/**
 * Playlist Manager
 *
 * Sistema de gestión de playlists musicales con soporte para
 * ordenamiento, filtrado, deduplicación y estadísticas.
 */

class Song {
  constructor(title, artist, duration, bpm, genre) {
    this.title = title;
    this.artist = artist;
    this.duration = duration; // segundos
    this.bpm = bpm;
    this.genre = genre;
  }

  // Retorna duración en formato mm:ss
  formatDuration() {
    const minutes = Math.floor(this.duration / 60);
    const seconds = this.duration % 60;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${paddedSeconds}`;
  }

  // Clave única para deduplicación
  getKey() {
    return `${this.title}|${this.artist}`;
  }
}

class Playlist {
  constructor(name) {
    this.name = name;
    this.songs = [];
  }

  // Agrega canción si no existe ya (deduplicación por título+artista)
  addSong(song) {
    const exists = this.songs.some(s => s.getKey() === song.getKey());
    if (!exists) {
      this.songs.push(song);
    }
    return this;
  }

  // Remueve canción por título; lanza error si no existe
  removeSong(title) {
    const index = this.songs.findIndex(s => s.title === title);
    if (index === -1) {
      throw new Error(`Canción "${title}" no encontrada en la playlist`);
    }
    this.songs.splice(index, 1);
    return this;
  }

  // Duración total en segundos
  getTotalDuration() {
    return this.songs.reduce((total, song) => total + song.duration, 0);
  }

  // Ordena canciones por el campo indicado
  sortBy(field) {
    const numericFields = ['duration', 'bpm'];
    return [...this.songs].sort((a, b) => {
      if (numericFields.includes(field)) {
        // Ordena en sentido inverso para campos numéricos
        return a[field] - b[field];
      }
      return a[field].localeCompare(b[field]);
    });
  }

  // Filtra canciones por género (insensible a mayúsculas)
  filterByGenre(genre) {
    return this.songs.filter(
      s => s.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  // BPM promedio de todas las canciones
  getAverageBpm() {
    if (this.songs.length === 0) return 0;
    const total = this.songs.reduce((sum, s) => sum + s.bpm, 0);
    return Math.round(total / this.songs.length);
  }

  // Top N artistas ordenados por cantidad de canciones (descendente)
  getTopArtists(n) {
    const counts = this.songs.reduce((acc, song) => {
      acc[song.artist] = (acc[song.artist] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([artist, count]) => ({ artist, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, n);
  }

  // Lista de géneros únicos presentes en la playlist
  getUniqueGenres() {
    return [...new Set(this.songs.map(s => s.genre))];
  }

  // Fusiona esta playlist con otra, sin duplicados
  merge(otherPlaylist) {
    const merged = new Playlist(`${this.name} + ${otherPlaylist.name}`);
    [...this.songs, ...otherPlaylist.songs].forEach(song => merged.addSong(song));
    return merged;
  }

  // Resumen de la playlist
  getSummary() {
    const totalSeconds = this.getTotalDuration();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const durationStr = hours > 0
      ? `${hours}h ${minutes}m ${seconds}s`
      : `${minutes}m ${seconds}s`;

    return {
      name: this.name,
      songCount: this.songs.length,
      totalDuration: durationStr,
      averageBpm: this.getAverageBpm(),
      genres: this.getUniqueGenres(),
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Song, Playlist };
}

if (require.main === module) {
  const playlist = new Playlist('Rock Classics');
  playlist.addSong(new Song('Bohemian Rhapsody', 'Queen', 354, 72, 'rock'));
  playlist.addSong(new Song('Hotel California', 'Eagles', 391, 75, 'rock'));
  playlist.addSong(new Song('Stairway to Heaven', 'Led Zeppelin', 482, 82, 'rock'));
  playlist.addSong(new Song('Smells Like Teen Spirit', 'Nirvana', 301, 117, 'grunge'));

  console.log('Resumen:', playlist.getSummary());
  console.log('Por duración:', playlist.sortBy('duration').map(s => `${s.title} (${s.formatDuration()})`));
  console.log('Top artistas:', playlist.getTopArtists(3));
}
