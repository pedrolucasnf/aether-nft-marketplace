const MICRO_ETH_FACTOR = 1_000_000;
const BRL_EXCHANGE_RATE = 16450;

export function parseEthToMicro(eth: string): number {
  if (!eth) return 0;
  const clean = eth.trim().replace(/[^0-9.]/g, '');
  if (!clean) return 0;
  const [integerPart = '0', decimalPart = ''] = clean.split('.');
  const normalizedDec = (decimalPart + '000000').slice(0, 6);
  return parseInt(integerPart, 10) * MICRO_ETH_FACTOR + parseInt(normalizedDec, 10);
}

export function formatMicroToEth(microUnits: number, decimals = 4): string {
  const safe = Math.round(microUnits);
  const isNeg = safe < 0;
  const abs = Math.abs(safe);
  const intPart = Math.floor(abs / MICRO_ETH_FACTOR);
  const rem = String(abs % MICRO_ETH_FACTOR).padStart(6, '0').slice(0, decimals);
  return `${isNeg ? '-' : ''}${intPart}.${rem}`;
}

export function addEthStrings(a: string, b: string): string {
  return formatMicroToEth(parseEthToMicro(a) + parseEthToMicro(b));
}

export function subEthStrings(a: string, b: string): string {
  const diff = parseEthToMicro(a) - parseEthToMicro(b);
  return formatMicroToEth(diff > 0 ? diff : 0);
}

export function multiplyEthByQty(eth: string, quantity: number): string {
  return formatMicroToEth(parseEthToMicro(eth) * Math.max(0, Math.floor(quantity)));
}

export function calculateDiscountEth(subtotalEth: string, percent: number): string {
  const units = parseEthToMicro(subtotalEth);
  return formatMicroToEth(Math.floor((units * Math.floor(percent)) / 100));
}

export function compareEthStrings(a: string, b: string): number {
  const ua = parseEthToMicro(a);
  const ub = parseEthToMicro(b);
  return ua === ub ? 0 : ua < ub ? -1 : 1;
}

export function formatEthInBrl(eth: string): string {
  const val = parseFloat(eth || '0') * BRL_EXCHANGE_RATE;
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
