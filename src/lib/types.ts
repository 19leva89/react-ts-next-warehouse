export interface UserData {
	name: string
	email: string
	role: string
}

export interface WarehouseData {
	id: string
	name: string
}

export interface ProductData {
	id: string
	imageId: string
	imageUrl: string
	name: string
	description: string
	stockThreshold: number
	stock: number
	price: number
	costPrice: number | null
}

export interface SalesData {
	id: string
	addedBy: string
	customerId: string
	customerName: string
	productId: string
	productName: string
	saleDate: Date
	quantity: number
}
