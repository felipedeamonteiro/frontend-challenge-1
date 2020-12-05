import React, { FormEvent, useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import SubHeader from '../../components/SubHeader';
import artistPhoto from '../../assets/User_profile2.png';

import { searchAndGetArtists } from '../../utils/client';

import styles from './Search.module.css';

export interface ImageData {
  height: number;
  url: string;
  width: number;
}

export interface ArtistSearchData {
  external_url: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: ImageData[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

/**
 * The Search component is responsible to show the information of the searched
 * artist on screen
 */

const Search: React.FC = () => {
   /**
   * These variables manage some local state used in this page:
   * searchArtist: manages the string in the search input;
   * inputError: manages the string of the error generated by the input field validation;
   * artistsList: manages the data came from the api about the artists searched. It also
   * begin the lifecycle of the component looking for data in local storage (this was used
   * to help the user when one get back from the '/artista' page).
   */
  const [searchArtist, setSearchArtist] = useState<string>('');
  const [inputError, setinputError] = useState<string>('');
  const [artistsList, setArtistsList] = useState<ArtistSearchData[]>(() => {
    const storagedArtists = localStorage.getItem(
      '@SomosEducacaoTesteFront: Artists',
    );

    if (storagedArtists) {
      return JSON.parse(storagedArtists);
    }

    return [];
  });

  // useEffect used to set data in local storage when artistList updates
  useEffect(() => {
    localStorage.setItem(
      '@SomosEducacaoTesteFront: Artists',
      JSON.stringify(artistsList),
    );
  }, [artistsList]);

  async function handleSearchArtist(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setinputError('');
    if (searchArtist.length < 4) {
      setinputError('A busca precisa ter pelo menos 4 caracteres.')
    } else {
      const artistResults = await searchAndGetArtists(searchArtist);
      setArtistsList(artistResults.data.artists.items);
    }
  }

  return (
    <>
      <SubHeader
        buttonHref="/"
        breadcrumb={[{ text: 'Home  >  Busca' }]}
        heading="Somos Front-end Challenge"
      />
      <div className={styles.container}>
        <h1>Buscar Artista</h1>

        <form onSubmit={handleSearchArtist}>
          <input
            value={searchArtist}
            onChange={e => setSearchArtist(e.target.value)}
            placeholder="Digite o nome do artista"
          />
          <button type="submit">Pesquisar</button>
        </form>

        {inputError.length > 2 && <p className={styles.error}>{inputError}</p>}

        <div className={styles.artists}>

          {artistsList.length > 0 && artistsList.map(artist => (
            <Link
              key={artist.id}
              to={`/artista/${artist.id}`}
            >
              {artist.images.length > 0 ? <img
                src={artist.images[0].url}
                alt={`Imagem de ${artist.name}`}
              /> : <img
              src={artistPhoto}
              alt={`Imagem de ${artist.name}`}
            />}
              <div>
                <strong>{artist.name}</strong>
              </div>
              <FiChevronRight size={20} />
            </Link>
          ))}
        </div>
      </div>

    </>
  )
}

export default Search;
