const useCurrencyFormat = (value: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value)
}

export {
  useCurrencyFormat
}
