//Existem três formas do Front-end consumir uma API
//As duas primeiras formas funcionam no ReactJS e no NextJS
//A terceira forma só funciona no NextJS
//Single Page Application (SPA) (com o useEffect e fetch, o que foi buscado pelo fetch não vai aparecer nos mecanismos de busca)
//Server Side Rendering (SSR)
//Static Site Generation (SSG)
/**
 * useEffect é FUNÇÃO nativa do react, ela dispara algo
 * sempre que algo mudar na minha aplicação, tipo efeitos colaterais:
 * quando algo mudar na minha aplicação, eu quero que outro algo aconteça
 */
import { format, parseISO } from 'date-fns';
//importando uma tipagem chamada GetStaticProps do next (é um tipo, como String, Integer, etc)
import { GetStaticProps } from "next";
import Head from "next/head";
import { api } from "../services/api"; //importando o axios
import { ptBR } from "date-fns/locale";
import Image from 'next/image';
import Link from 'next/link';
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from './home.module.scss';
import { usePlayer } from "../contexts/PlayerContext";
type Episode = {
  id: string,
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  durationAsString: string,
  publishedAt: string,
  url: string
}
type HomeProps = {
  //latestEpisodes: array de objetos
  latestEpisodes: Array<Episode>,
  allEpisodes: Array<Episode>
}
export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();
  const episodeList = [...latestEpisodes, ...allEpisodes];
  /**
   * primeiro jeito de fazer: SPA
   * 
   * @param: o que eu quero executar (no formato arrow function)
   * @param[]: quando eu quero executar. Trata-se de umarray com variáveis, 
   * quando elas mudarem, realiza o primero param. Se eu passar um array vazio,
   * o useEffect só vai executar o primeiro param na hora que for carregado, uma única vez
   */
  //useEffect(()=>{
  //função fetch busca jsons
  //fetch('http://localhost:3333/episodes')
  //.then(response =>response.json())
  //.then(data => console.log(data));
  //}, []);
  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcaster</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              //quando a gente usa map dentro do react, serão retornados vários itens
              //cada item deve ter um identificador único, para que o React possa re-renderizar só os LI específicos
              //aqui nesse caso, vamos usar o id do episodio como identificador único dos LI
              <li key={episode.id}>
                <Image 
                width={192} 
                height={192} 
                src={episode.thumbnail} 
                alt={episode.title}
                objectFit="cover"
                />


                <div className={styles.episodeDetails}>
                  {/* a tag Link do next permite manter o resto da página e só carregar o link clicado */}
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type='button' onClick={()=> playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os episódio</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index)=>{
              return(
                <tr key={episode.id}>
                  <td style={{ width: 72}}>
                    <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>                     
                        <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>
                    {episode.members}
                  </td>
                  <td style={{ width: 100}}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={()=> playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </section>
    </div>
  )
}

// //pra fazer server side rendering (segundo jeito de fazer, aparece nos mecanismos de busca), 
// //basta exportar dentro de qualquer arquivo da pasta pages o seguinte export, QUE VAI SER EXECUTADO PRIMEIRO, toda vez
// //que algum usuário acessar a página index
// export async function getServerSideProps(){  
//   const resposta = await fetch('http://localhost:3333/episodes');
//   const data = await resposta.json();
//   return{
//     props: {
//       episodes: data,
//     }
//   }
//   //RETORNANDO PROPS, e essa função sendo executada primeiro, estará acessivel dentro de qualquer componente
//   //aqui nesse arquivo index.tsx
// }

//se você criar essa função async getStaticProps, NextJS vai pré-renderizar
//essa página com os parâmetros retornados por essa função. Estando pré-renderizada
//na hora da build do projeto, essa página fica "estática". O revalidate serve
//pra rebuildar essa página sem precisar do programador vir aqui, buildar todo o codigo fonte de novo
//pra fazer Static Site Generation, basta mudar o nome dessa função e adicionar um revalidate no objeto de retorno
//isso só funciona no framework next, e SSG significa que a cada X segundos (definidos no revalidate), a
//página retornada index.html vai ficar a mesma, o servidor só vai "montar" uma página nova a cada X segundos
export const getStaticProps: GetStaticProps = async () => {
  //esse recurso só funciona em produção 
  // const resposta = await fetch('http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc')
  // const data = await resposta.json();
  //as duas linhas acima, com o metodo fetch, eu vou trocar pelo axios, que é um framework pra fazer ajax que dá mais opções
  let axiosrequestconfig = {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  }
  const { data } = await api.get("episodes", axiosrequestconfig);
  //agora vou pegar os dados (data) e formatar eles certinho
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  });
  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
  //RETORNANDO PROPS, e essa função sendo executada primeiro, estará acessivel dentro de qualquer componente
  //aqui nesse arquivo index.tsx
}