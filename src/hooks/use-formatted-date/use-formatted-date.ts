import formatDate, { masks } from 'dateformat';
import { useState, useLayoutEffect } from 'react';

export const useFormattedDate = (date: Date | string | undefined) => {
  const [formattedDate, setFormattedDate] = useState<string>('--/--/----');

  useLayoutEffect(() => {
    if (date) {
      setFormattedDate(formatDate(date, masks.paddedShortDate));
    }
  }, []);

  return formattedDate;
};
