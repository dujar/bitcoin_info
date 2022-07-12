export enum ESpan {
  ALL = "all",
  WEEK = "7days",
  MONTH = "1month",
  DAY = "24hours",
}

export enum ECurrency {
  AED = "AED",
  AFN = "AFN",
  ALL = "ALL",
  AMD = "AMD",
  ANG = "ANG",
  AOA = "AOA",
  ARS = "ARS",
  AUD = "AUD",
  AWG = "AWG",
  AZN = "AZN",
  BAM = "BAM",
  BBD = "BBD",
  BDT = "BDT",
  BGN = "BGN",
  BHD = "BHD",
  BIF = "BIF",
  BMD = "BMD",
  BND = "BND",
  BOB = "BOB",
  BRL = "BRL",
  BSD = "BSD",
  BTN = "BTN",
  BWP = "BWP",
  BYN = "BYN",
  BZD = "BZD",
  CAD = "CAD",
  CDF = "CDF",
  CHF = "CHF",
  CLF = "CLF",
  CLP = "CLP",
  USD = "USD",
}
export enum ECrypto {
  BTC = "core",
  BCH = "cash",
}

export interface IFeed {
  time: string;
  feed: number;
  base: ECrypto;
  price: ECurrency;
}
export interface ILatestFeed {
  feed: number;
  time: string;
}

export type TItemNames =
  | "title"
  | "link"
  | "dc:creator"
  | "pubDate"
  | "category"
  | "guid"
  | "description"
  | "content:encoded"
  | "bnmedia:post-thumbnail"
  | "bnmedia:barker_title"
  | "bnmedia:late_barker_title";

export interface IState {
  news: INewsResponse;
  feed: IFeed[];
  historicalFeed: IFeed[];
  base: ECrypto;
  price: ECurrency;
}
export interface INewsResponse {
  attributes: any;
  children: INewsResponse[];
  name:
    | "channel"
    | "title"
    | "image"
    | "item"
    | TItemNames
    | "generator"
    | "atom:link"
    | "link"
    | "description"
    | "lastBuildDate"
    | "language"
    | "sy:updatePeriod"
    | "sy:updateFrequency";
  value: string;
}
