import { supabase } from '../../supabaseClient';

// Получение информации об альбоме
export const fetchAlbumApi = async (albumId) => {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', albumId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching album:', error.message);
    throw new Error('Error fetching album');
  }

  if (data) {
    if (typeof data.genre === 'string') {
      data.genre = JSON.parse(data.genre);
    }
    if (typeof data.format === 'string') {
      data.format = JSON.parse(data.format);
    }
  }

  return data;
};

// Удаление альбома
export const deleteAlbumApi = async (albumId) => {
  try {
    await supabase.from('format_album').delete().eq('album_id', albumId);
    await supabase.from('genre_album').delete().eq('album_id', albumId);

    const { data: albumData, error: albumError } = await supabase
      .from('albums')
      .delete()
      .eq('id', albumId)
      .select()
      .maybeSingle();

    if (albumError) {
      throw new Error(albumError.message);
    }

    if (albumData?.image) {
      const coverPath = `covers/${albumData.artist}/${albumData.title}`;
      const { error: storageError } = await supabase.storage
        .from('album_covers')
        .remove([coverPath]);

      if (storageError) {
        throw new Error(storageError.message);
      }
    }

    return albumData;
  } catch (error) {
    console.error('Error deleting album:', error.message);
    throw error;
  }
};

// Проверка, является ли альбом избранным
export const checkIfFavoriteApi = async (userId, albumId) => {
  const { data } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('album_id', albumId)
    .maybeSingle();

  return !!data;
};

// Добавление альбома в избранное
export const addAlbumToFavoritesApi = async (user, albumId) => {
  const { data: albumData, error: albumError } = await supabase
    .from('albums')
    .select('title, artist, image')
    .eq('id', albumId)
    .maybeSingle();

  if (albumError) {
    console.error('Error fetching album details:', albumError);
    throw albumError;
  }

  const { error } = await supabase.from('favorites').insert([
    {
      user_id: user.id,
      album_id: albumId,
      title: albumData.title,
      artist: albumData.artist,
      image: albumData.image,
    },
  ]);

  if (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }

  return true;
};
