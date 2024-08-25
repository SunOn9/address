import { GetZoneChartDto } from '../dto/get-zone-chart.dto'

export function getZoneChartAPI(request: GetZoneChartDto, url: string): string {
  return (
    url +
    `zipCode3Digit=${request.zipCode3Digit}&shippingDate=${getCurrentDate()}`
  )
}

function getCurrentDate(): string {
  const currentDate: Date = new Date()

  const currentDay: number = currentDate.getDate()
  const currentMonth: number = currentDate.getMonth() + 1 // Adding 1 because months are zero-indexed
  const currentYear: number = currentDate.getUTCFullYear() % 100

  return `${currentMonth}/${currentDay}/${currentYear}`
}
