export interface UserData {
	name: string
	email: string
	role: string
}

export interface StoreData {
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
}

export interface SalesData {
	id: string
	addedBy: string
	merchantId: string
	merchantName: string
	productId: string
	productName: string
	saleDate: Date
	quantity: number
}
