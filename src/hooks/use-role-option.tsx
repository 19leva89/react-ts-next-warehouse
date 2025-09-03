import { useTranslations } from 'next-intl'

export const useRoleOptions = () => {
	const t = useTranslations('Interface')

	return [
		{
			label: t('admin'),
			value: 'ADMIN',
		},
		{
			label: t('productManager'),
			value: 'PRODUCT_MANAGER',
		},
		{
			label: t('salesManager'),
			value: 'SALES_MANAGER',
		},
		{
			label: t('viewer'),
			value: 'VIEWER',
		},
	]
}
