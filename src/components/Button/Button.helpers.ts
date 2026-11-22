import type { ButtonSizeDef, ButtonVariantDef } from './Button.types';

export const getBtnSizeClass = (size: ButtonSizeDef) => {
  switch (size) {
    case 'xs':
      return 'btn-xs';

    case 'sm':
      return 'btn-sm';

    case 'lg':
      return 'btn-lg';

    case 'xl':
      return 'btn-xl';

    case '2xl':
      return 'btn-2xl';

    case 'custom':
      return 'btn-custom';

    default:
      return 'btn-md';
  }
};

export const getBtnVariantClass = (variant: ButtonVariantDef) => {
  switch (variant) {
    case 'secondary':
      return 'btn-secondary';

    case 'mono':
      return 'btn-mono';

    case 'ghost':
      return 'btn-ghost';

    case 'alert':
      return 'btn-alert';

    default:
      return 'btn-primary';
  }
};
