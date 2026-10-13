'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function addProduct(formData: FormData) {
  const title = (formData.get('title') as string)?.trim();
  const price = parseFloat(formData.get('price') as string);
  const category = (formData.get('category') as string)?.trim();
  const stock = parseInt(formData.get('stock') as string, 10);
  const sku = (formData.get('sku') as string)?.trim().toUpperCase();

  if (!title || isNaN(price) || !category || isNaN(stock) || !sku) {
    throw new Error('Please fill in all required fields properly.');
  }

  await connectDB();

  await Product.create({
    title,
    price,
    category,
    stock,
    sku,
  });

  revalidatePath('/catalog');
  revalidatePath('/products');
}

export async function deleteProduct(id: string) {
  if (!id) {
    throw new Error('Product ID is required');
  }

  await connectDB();
  await Product.findByIdAndDelete(id);

  revalidatePath('/catalog');
  revalidatePath('/products');
}
