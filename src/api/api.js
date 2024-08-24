import { supabase } from '../../supabaseClient';

// Получение альбомов с фильтрами
export const fetchAlbumsApi = async ({ page, perPage, searchTerm, genre, year, formats }) => {
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;

  let query = supabase
    .from('albums')
    .select('*')
    .range(start, end);

  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,artist.ilike.%${searchTerm}%`);
  }

  if (genre) {
    const { data: genreData, error: genreError } = await supabase
      .from('genre')
      .select('genre_id')
      .eq('genre', genre)
      .single();

    if (genreError || !genreData) {
      console.error('Ошибка при получении жанра:', genreError ? genreError.message : 'Жанр не найден');
      return [];
    }

    const genreId = genreData.genre_id;

    const { data: genreAlbums, error: genreAlbumsError } = await supabase
      .from('genre_album')
      .select('album_id')
      .eq('genre_id', genreId);

    if (genreAlbumsError || genreAlbums.length === 0) {
      console.error('Ошибка при получении альбомов жанра или альбомы не найдены:', genreAlbumsError ? genreAlbumsError.message : 'Альбомы не найдены');
      return [];
    }

    const albumIds = genreAlbums.map(ga => ga.album_id);
    query = query.in('id', albumIds);
  }

  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte('release_date', startDate).lte('release_date', endDate);
  }

  if (formats && formats.length > 0) {
    const { data: formatData, error: formatError } = await supabase
      .from('format')
      .select('format_id')
      .in('format', formats);

    if (formatError || !formatData || formatData.length === 0) {
      console.error('Ошибка при получении форматов:', formatError ? formatError.message : 'Форматы не найдены');
      return [];
    }

    const formatIds = formatData.map(f => f.format_id);

    const { data: formatAlbums, error: formatAlbumsError } = await supabase
      .from('format_album')
      .select('album_id')
      .in('format_id', formatIds);

    if (formatAlbumsError || formatAlbums.length === 0) {
      console.error('Ошибка при получении альбомов по форматам или альбомы не найдены:', formatAlbumsError ? formatAlbumsError.message : 'Альбомы не найдены');
      return [];
    }

    const albumIds = formatAlbums.map(fa => fa.album_id);
    query = query.in('id', albumIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Ошибка при получении альбомов:', error.message);
    throw new Error(error.message);
  }

  return data;
};

// Получение жанров из таблицы альбомов
export const fetchGenresApi = async () => {
  const { data, error } = await supabase.from('albums').select('genre');

  if (error) {
    console.error('Ошибка при получении жанров из альбомов:', error.message);
    throw new Error(error.message);
  }

  const genres = new Set();
  try {
    data.forEach(album => {
      if (album.genre) {
        if (typeof album.genre === 'string' && album.genre.trim().startsWith('[')) {
          JSON.parse(album.genre).forEach(genre => genres.add(genre));
        } else {
          console.error('Некорректные данные жанра:', album.genre);
        }
      }
    });
  } catch (parseError) {
    console.error('Ошибка при парсинге данных жанра:', parseError.message);
    throw new Error('Ошибка при парсинге данных жанра.');
  }

  return Array.from(genres).map(genre => ({ value: genre, label: genre }));
};

// Сохранение нового жанра в Supabase
export const saveGenreToSupabaseApi = async (newGenre) => {
  const { data, error } = await supabase.from('genre').insert([{ genre: newGenre.value }]);

  if (error) {
    console.error('Ошибка при добавлении жанра в Supabase:', error.message);
    throw new Error(error.message);
  }

  return newGenre;
};

// Получение пользователя по email и паролю
export const fetchUserApi = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('isEditor')
    .eq('id', data.user.id)
    .single();

  if (userError) throw userError;

  return { ...data.user, isEditor: userData.isEditor };
};

// Регистрация нового пользователя
export const registerUserApi = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error('Ошибка при регистрации пользователя:', error.message);
    throw error;
  }

  const { error: userError } = await supabase
    .from('users')
    .insert([{ id: data.user.id, email: data.user.email, isEditor: false }]);

  if (userError) {
    console.error('Ошибка при вставке дополнительных данных пользователя:', userError.message);
    throw userError;
  }

  return { ...data.user, isEditor: false };
};

// Получение текущего авторизованного пользователя
export const getUserApi = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('isEditor')
    .eq('id', user.id)
    .single();

  if (userError) throw userError;

  return { ...user, isEditor: userData.isEditor };
};

// Выход пользователя из системы
export const logoutUserApi = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Получение годов релизов альбомов
export const fetchYearsApi = async () => {
  const { data, error } = await supabase.from('albums').select('release_date');

  if (error) {
    console.error('Ошибка при получении годов:', error.message);
    throw new Error(error.message);
  }

  const years = Array.from(new Set(data.map(album => album.release_date.split('-')[0])))
    .sort()
    .map(year => ({ value: year, label: year }));

  return years;
};

// Получение форматов из таблицы альбомов
export const fetchFormatsApi = async () => {
  const { data, error } = await supabase.from('albums').select('format');

  if (error) {
    console.error('Ошибка при получении форматов из альбомов:', error.message);
    throw new Error(error.message);
  }

  const formats = new Set();
  try {
    data.forEach(album => {
      if (album.format) {
        // Проверка формата данных перед JSON.parse
        if (typeof album.format === 'string' && album.format.trim().startsWith('[')) {
          JSON.parse(album.format).forEach(format => formats.add(format));
        } else {
          console.error('Некорректные данные формата:', album.format);
        }
      }
    });
  } catch (parseError) {
    console.error('Ошибка при парсинге данных форматов:', parseError.message);
    throw new Error('Ошибка при парсинге данных форматов.');
  }

  return Array.from(formats).map(format => ({ value: format, label: format }));
};
