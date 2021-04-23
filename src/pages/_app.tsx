import '../styles/global.scss'
import { Header } from '../components/Header'
import { Player } from '../components/Player'
import styles from "../styles/app.module.scss"
import { PlayerContextProvider } from '../contexts/PlayerContext'
import { useState } from 'react'

//esse arquivo APP sempre vai estar presente em todas as páginas da minha aplicação
//por ser uma Single Page Application, esse arquivo APP convém ter o header (que é sempre igual),
//convém ter as sidebars, navbars, etc
function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider >
    <div className={styles.wrapper}>
      <main>
      <Header/>
      <Component {...pageProps} />
      </main>
      <Player/>
    </div>
    </PlayerContextProvider>
  )
}
//para rodar o servidor simulação de backend, adicionamos um script no package.json para abrir
//o pacote json-server que é só um simuladorzinho para desenvolvimento. "server": "json-server server.json -w -d 750 -p 3333"
//depois de rodar isso, aí podemos dar npm run dev pra rodar nosso frontend

export default MyApp

