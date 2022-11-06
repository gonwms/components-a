export const formatCurrency=(number:number):string => {
	const res = new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'USD',
	}).format(number)
	return res
}