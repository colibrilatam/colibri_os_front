import axios from 'axios';

export const translationService = {
  translate: async (
    text,
    source = 'en',
    target = 'es',
  ) => {
    const response = await axios.post(
      '/api/translate',
      {
        text,
        source,
        target,
      },
    );

    return response.data.translation;
  },
};