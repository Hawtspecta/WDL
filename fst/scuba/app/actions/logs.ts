'use server';

import { revalidatePath } from 'next/cache';
import { addLog, updateLog, deleteLog } from '@/app/lib/db';

export async function createLogAction(formData: FormData) {
  const location = formData.get('location') as string;
  const depth = Number(formData.get('depth'));
  const duration = Number(formData.get('duration'));
  const date = formData.get('date') as string;

  if (!location || !depth || !duration || !date) {
    throw new Error('Missing required fields');
  }

  addLog({ location, depth, duration, date });
  
  // Purge the cached data for the logs route
  revalidatePath('/logs');
}

export async function updateLogAction(formData: FormData) {
  const id = formData.get('id') as string;
  const location = formData.get('location') as string;
  const depth = Number(formData.get('depth'));
  const duration = Number(formData.get('duration'));
  const date = formData.get('date') as string;

  if (!id) {
    throw new Error('ID is required');
  }

  updateLog(id, { location, depth, duration, date });
  
  // Purge the cached data for the logs route
  revalidatePath('/logs');
}

export async function deleteLogAction(formData: FormData) {
  const id = formData.get('id') as string;
  
  if (!id) {
    throw new Error('ID is required');
  }

  deleteLog(id);
  
  // Purge the cached data for the logs route
  revalidatePath('/logs');
}
