import { supabase } from '../../../supabaseClient';

// Helper to fetch genres
export const fetchGenresFromSupabase = async () => {
  let { data, error } = await supabase.from('genre').select('*');
  if (error) throw new Error('Error fetching genres: ' + error.message);
  return data;
};

// Helper to check if an album exists
export const checkIfSuchAlbumExists = async (title, artist) => {
  let { data, error } = await supabase
    .from('albums')
    .select('title', 'artist')
    .eq('title', title)
    .eq('artist', artist);

  if (error) throw new Error('Error checking if album exists: ' + error.message);
  return data.length > 0;
};

// Helper to save genres
export const saveGenresToSupabase = async (genres) => {
  const genreIds = [];
  for (const genre of genres) {
    const trimmedGenre = genre.trim();
    let { data, error } = await supabase
      .from('genre')
      .select('genre_id')
      .eq('genre', trimmedGenre)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error('Error checking genre: ' + error.message);

    if (data) {
      genreIds.push(data.genre_id);
    } else {
      const { data: newGenre, error: genreError } = await supabase
        .from('genre')
        .insert({ genre: trimmedGenre })
        .select()
        .single();

      if (genreError) throw new Error('Error adding genre: ' + genreError.message);

      genreIds.push(newGenre.genre_id);
    }
  }
  return genreIds;
};

// Helper to save formats
export const saveFormatsToSupabase = async (formats) => {
  const formatIds = [];
  for (const format of formats) {
    const trimmedFormat = format.trim();
    let { data, error } = await supabase
      .from('format')
      .select('format_id')
      .eq('format', trimmedFormat)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error('Error checking format: ' + error.message);

    if (data) {
      formatIds.push(data.format_id);
    } else {
      const { data: newFormat, error: formatError } = await supabase
        .from('format')
        .insert({ format: trimmedFormat })
        .select()
        .single();

      if (formatError) throw new Error('Error adding format: ' + formatError.message);

      formatIds.push(newFormat.format_id);
    }
  }
  return formatIds;
};

// Helper to upload images
export const uploadImageToSupabase = async (artist, title, imageFile) => {
  const coverPath = `covers/${artist}/${title}`;
  const { error: uploadError } = await supabase.storage
    .from('album_covers')
    .upload(coverPath, imageFile, { upsert: true });

  if (uploadError) throw new Error('Error uploading image: ' + uploadError.message);

  const { data: publicUrlResponse, error: urlError } = supabase.storage
    .from('album_covers')
    .getPublicUrl(coverPath);

  if (urlError) throw new Error('Error getting public URL: ' + urlError.message);

  return publicUrlResponse.publicUrl;
};
