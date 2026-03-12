'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

interface StrainData {
  strain: string
  cbd_ratio: number
  thc_ratio: number
  melhora: number
}

interface SymptomData {
  sintoma: string
  pacientes: number
  melhora: number
}

interface RWEChartsProps {
  strainData: StrainData[]
  symptomData: SymptomData[]
}

const chartConfig = {
  melhora: {
    label: 'Melhora Media',
    color: 'hsl(var(--primary))',
  },
  pacientes: {
    label: 'Pacientes',
    color: 'hsl(var(--chart-2))',
  },
  cbd_ratio: {
    label: 'CBD',
    color: 'hsl(var(--chart-1))',
  },
  thc_ratio: {
    label: 'THC',
    color: 'hsl(var(--chart-4))',
  },
}

export function RWECharts({ strainData, symptomData }: RWEChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Strain Effectiveness Chart */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Eficacia por Strain</CardTitle>
          <CardDescription>
            Correlacao entre variedade e melhora percebida (0-5)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strainData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis 
                  dataKey="strain" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  domain={[0, 5]} 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="melhora" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name="Melhora Media"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Symptom Analysis Chart */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Analise por Sintoma</CardTitle>
          <CardDescription>
            Numero de pacientes e melhora media por tipo de sintoma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis 
                  dataKey="sintoma" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 5]}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="pacientes" 
                  fill="hsl(var(--chart-2))" 
                  radius={[4, 4, 0, 0]}
                  name="Pacientes"
                />
                <Bar 
                  yAxisId="right"
                  dataKey="melhora" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name="Melhora (0-5)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* CBD/THC Ratio vs Improvement */}
      <Card className="bg-card/50 border-border/50 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Proporcao CBD:THC vs Melhora</CardTitle>
          <CardDescription>
            Visualizacao da relacao entre proporcao de canabinoides e eficacia do tratamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={strainData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis 
                  dataKey="strain" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cbd_ratio" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="CBD Ratio"
                />
                <Line 
                  type="monotone" 
                  dataKey="thc_ratio" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="THC Ratio"
                />
                <Line 
                  type="monotone" 
                  dataKey="melhora" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  name="Melhora Media"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
