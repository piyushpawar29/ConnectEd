"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface MentorSkillChartProps {
  mentor: any
}

export default function MentorSkillChart({ mentor }: MentorSkillChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Cleanup previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Generate skills data
    const skills = mentor.expertise?.slice(0, 6) || [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "UI/UX",
      "System Design",
    ]

    // Generate random skill levels (in a real app, this would come from the API)
    const skillLevels = skills.map(() => 70 + Math.floor(Math.random() * 30))

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: skills,
        datasets: [
          {
            label: "Skill Level",
            data: skillLevels,
            backgroundColor: "rgba(0, 191, 255, 0.2)",
            borderColor: "rgba(0, 191, 255, 1)",
            pointBackgroundColor: "rgba(0, 191, 255, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(0, 191, 255, 1)",
          },
        ],
      },
      options: {
        scales: {
          r: {
            angleLines: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            pointLabels: {
              color: "rgba(255, 255, 255, 0.7)",
              font: {
                size: 12,
              },
            },
            ticks: {
              backdropColor: "transparent",
              color: "rgba(255, 255, 255, 0.5)",
              z: 100,
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        elements: {
          line: {
            borderWidth: 3,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [mentor])

  return (
    <div className="w-full h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

