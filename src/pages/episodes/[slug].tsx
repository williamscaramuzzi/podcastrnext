import { format, parseISO } from "date-fns";
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "./episode.module.scss";
import Image from "next/image";
import Head from "next/head";
import { usePlayer } from "../../contexts/PlayerContext"
type Episode = {
    id: string,
    title: string,
    members: string,
    thumbnail: string,
    description: string,
    duration: number,
    durationAsString: string,
    publishedAt: string,
    url: string
}
type EpisodeProps = {
    episode: Episode
}


export default function Episode({ episode }: EpisodeProps) {
    //todo método do React que começa com use (useEffect, useRouter, useState) só pode ser declarado dentro de componentes
    //então eu não posso dar useRouter lá embaixo na getStaticProps que é só função javascript
    //const router = useRouter();
    const { play } = usePlayer();
    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title}</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image width={780} height={160} src={episode.thumbnail} objectFit="cover" />
                <button type="button" onClick={() => {
                    play(episode);
                }}>
                    <img src="/play.svg" alt="Tocar episodio" />
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />

        </div>
    )
}
//toda rota que possuir colchetes [] (tipo [slug].tsx) precisa ter esse método getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
    let parametrosprofetchdoaxiosbuscarepisodios = {
        params: {
            _limit: 2, //só vai pegar os primeiros 2 episódios
            _sort: 'published_at', //ordenados pela data de publicação
            _order: 'desc' //em ordem decrescente (descending)
        }
    }
    const { data } = await api.get('episodes', parametrosprofetchdoaxiosbuscarepisodios);
    const paths = data.map(episode => {
        return { params: { slug: episode.id } } //esse é o return do maps, pra cada episodio retornar um objeto construido dessa forma: objeto.params.slug
    });

    //dessa forma, paths é um array, porque o retorno de .map() é um array
    return {
        paths: paths,
        fallback: 'blocking'
    }
    //esse método diz pro next quais paths deve gerar de forma estática no momento da build.
    //considerando que essa página [slug] é dinâmica, ou seja, gerada através de parâmetros, 
    //se eu passar paths vazio, o next entende que não precisa buildar nenhum filho de /episodes estaticamente no momento da build,
    //aí todos os derivados de /episode serão gerados na hora do acesso

    //o parÂmetro fallback significa carregamento. Se estiver no modo 'blockin' significa que o next vai pegar os paths dinâmicos
    //e só vai direcionar o cliente pra página quando os dados estiverem prontos. Em seguida ele deixa essa página armazenada em cache
    //para que os próximos usuários do site não precisem esperar tanto, ou seja, a página que era gerada dinamicamente na hora do acesso
    //agora vai ficar criada, como se tivesse sido criada static no momento da build
}
export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params;
    const { data } = await api.get(`/episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    }
    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24,//24 hours
    }
}