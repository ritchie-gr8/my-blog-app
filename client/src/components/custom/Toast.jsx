import { toast as sonnerToast } from "sonner";

const createToast = (message = "Attention needed", description, color) => {
  return sonnerToast(message, {
    description: description,
    style: {
        backgroundColor: color,
        color: '#fff',
    }
  })
};

const toast = {
  success: (message, description) =>
    createToast(message, description, "#12B279"),
  error: (message, description) =>
    createToast(message, description, "#EB5164"),
};

export { toast };
