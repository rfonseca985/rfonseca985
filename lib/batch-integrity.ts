import crypto from 'crypto'

/**
 * Gerador de Selo de Confiança - DNA Digital do Lote
 * Cria um hash SHA-256 imutável para cada lote de cannabis
 * Se o laudo laboratorial for alterado, o hash quebra (detectando adulteração)
 */

export interface BatchData {
  codigo_qr: string
  strain: string
  cbd_percent?: number
  thc_percent?: number
  status: 'SEMENTE' | 'CULTIVO' | 'COLHEITA' | 'EXTRACAO' | 'LABORATORIO' | 'DISPENSADO'
  data_plantio?: string
  data_colheita?: string
  quantidade_gramas?: number
}

/**
 * Gera o hash de integridade SHA-256 para um lote
 * Este hash serve como DNA digital - qualquer alteração no conteúdo quebra o hash
 */
export function generateBatchSeal(data: BatchData): string {
  const content = [
    data.codigo_qr,
    data.strain,
    data.cbd_percent?.toString() || '',
    data.thc_percent?.toString() || '',
    data.status,
    data.data_plantio || '',
    data.data_colheita || '',
    data.quantidade_gramas?.toString() || '',
  ].join('|')

  return crypto.createHash('sha256').update(content).digest('hex')
}

/**
 * Verifica a integridade de um lote comparando o hash armazenado com o recalculado
 * Retorna true se o hash é válido (sem adulteração)
 */
export function verifyBatchIntegrity(data: BatchData, storedHash: string): boolean {
  const calculatedHash = generateBatchSeal(data)
  return calculatedHash === storedHash
}

/**
 * Cria uma entrada de timeline com hash anterior e atual
 * Permite rastrear as mudanças de status do lote
 */
export function createTimelineEntry(
  previousData: BatchData,
  currentData: BatchData
) {
  return {
    hash_anterior: generateBatchSeal(previousData),
    hash_atual: generateBatchSeal(currentData),
    timestamp: new Date().toISOString(),
  }
}

/**
 * Valida a cadeia de integridade de um lote
 * Verifica se todos os hashes na timeline estão corretos
 */
export function validateBatchChain(
  entries: Array<{
    hash_anterior?: string
    hash_atual: string
  }>
): boolean {
  for (let i = 1; i < entries.length; i++) {
    // O hash atual da entrada anterior deve ser igual ao hash anterior da entrada atual
    if (entries[i - 1].hash_atual !== entries[i].hash_anterior) {
      return false
    }
  }
  return true
}
