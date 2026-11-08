const ETH_SCALE = 1000000;
const ETH_BRL_RATE = 16450;

export function toMicroEth(value: string): number {
  if (!value || typeof value !== 'string') return 0;
  const sanitized = value.trim().replace(/[^0-9.]/g, '');
  if (!sanitized) return 0;
  const parts = sanitized.split('.');
  const whole = parts[0] || '0';
  const fraction = parts[1] || '';
  const paddedFraction = (fraction + '000000').slice(0, 6);
  return parseInt(whole, 10) * ETH_SCALE + parseInt(paddedFraction, 10);
}

export function fromMicroEth(units: number, precision = 4): string {
  const rounded = Math.round(units);
  const negative = rounded < 0;
  const abs = Math.abs(rounded);
  const whole = Math.floor(abs / ETH_SCALE);
  const rem = String(abs % ETH_SCALE).padStart(6, '0').slice(0, precision);
  return (negative ? '-' : '') + whole + '.' + rem;
}

export function sumEth(a: string, b: string): string {
  return fromMicroEth(toMicroEth(a) + toMicroEth(b));
}

export function subtractEth(a: string, b: string): string {
  const diff = toMicroEth(a) - toMicroEth(b);
  return fromMicroEth(diff > 0 ? diff : 0);
}

export function multiplyEth(eth: string, qty: number): string {
  return fromMicroEth(toMicroEth(eth) * Math.max(0, Math.floor(qty)));
}

export function percentageEth(eth: string, pct: number): string {
  const units = toMicroEth(eth);
  return fromMicroEth(Math.floor((units * Math.floor(pct)) / 100));
}

export function formatBrl(ethStr: string): string {
  const numeric = parseFloat(ethStr || '0');
  return (numeric * ETH_BRL_RATE).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
