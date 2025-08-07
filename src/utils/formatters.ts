// Função para limpar o telefone (remover caracteres não numéricos)
export const cleanPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

// Função para formatar o telefone para exibição
export const formatPhone = (phone: string): string => {
  const cleaned = cleanPhone(phone);
  
  if (cleaned.length === 11) {
    // Formato: (11) 99999-9999
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    // Formato: (11) 9999-9999
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Retorna o original se não conseguir formatar
};

// Função para aplicar máscara durante a digitação
export const applyPhoneMask = (value: string): string => {
  const cleaned = cleanPhone(value);
  
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 7) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  } else if (cleaned.length <= 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

// Função para gerar link do WhatsApp
export const generateWhatsAppLink = (phone: string, message?: string): string => {
  const cleaned = cleanPhone(phone);
  const formattedPhone = cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  return `https://wa.me/${formattedPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

// Função para limpar o RG (remover caracteres não numéricos)
export const cleanRg = (rg: string): string => {
  return rg.replace(/\D/g, '');
};