import { type z } from 'zod';
import { carbonActionSchema } from '@/lib/validators/action';

type CarbonAction = z.infer<typeof carbonActionSchema>;

export function calculateCO2(data: CarbonAction): number {
  if (data.category === 'transport') {
    switch (data.subcategory) {
      case 'flight':
        return data.distance_km * 0.15;
      case 'car':
        return (data.distance_km * 0.12) / (data.passengers || 1);
      case 'bus':
        return data.distance_km * 0.08;
      case 'train':
        return data.distance_km * 0.04;
      case 'bike':
      case 'walk':
        return 0;
      default:
        return 0;
    }
  }

  if (data.category === 'energy') {
    let factor = 1;
    if (data.subcategory === 'electricity') {
      factor = 0.4;
    } else if (data.subcategory === 'gas') {
      factor = data.unit === 'therms' ? 5.3 : 0.2;
    } else if (data.subcategory === 'heating_oil') {
      factor = 2.68;
    }
    return data.amount * factor;
  }

  if (data.category === 'food') {
    const factors: Record<string, number> = {
      meat_beef: 27.0,
      meat_chicken: 6.9,
      meat_pork: 12.1,
      dairy: 3.2,
      vegetables: 2.0,
      grains: 2.5,
      processed: 4.0,
      dining_out: 5.0, // per meal roughly
    };
    const factor = factors[data.subcategory] || 2.0;
    
    // adjust roughly by unit
    if (data.unit === 'servings') {
      return (data.amount * factor) / 4; // assuming 1kg = 4 servings
    }
    return data.amount * factor;
  }

  if (data.category === 'shopping') {
    const factors: Record<string, number> = {
      clothing: 20.0, // approx kg CO2 per item
      electronics: 50.0,
      furniture: 100.0,
      other: 10.0,
    };
    return data.amount * (factors[data.subcategory] || 10.0);
  }

  return 0;
}
