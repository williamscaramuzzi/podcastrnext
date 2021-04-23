export function convertDurationToTimeString(duration: number){
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration%3600)/60);
    const seconds = duration % 60;

    const vetor = [hours, minutes, seconds];

    //agora eu pego cada uma dessas unidades (hora, minuto e segundo)
    //e converto pra string, sendo que o padStart faz sempre mostrar 2 dígitos, com um 0 na frente se precisar
    // tipo, se der 5 minutos, vai mostrar 05 minutos
    let timeString = vetor.map(unit => String(unit).padStart(2, '0')).join(':');
    //o resultado de um map continua sendo um Array
    // quando eu dou .join, eu junto todos os elementos de um array 
    //e escolho um caractere : pra estar em cada junção, ficando HH:MM:SS
    return timeString;
}