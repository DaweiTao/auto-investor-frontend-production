export default interface ITickerDoc{
    contract: any,
    tickerData: ITicker[],
}


export interface ITicker{
    date: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    average: number,
    barCount: number,
    epoch: any,
    prevClose: number,
}