
Prerechizite:

1. node (https://nodejs.org/en/download/)

Pentru a rula projectul: 

```
cd ~/proiecte-master/lexicologie-morfologie-si-sintaxa-computationala/laborator2
node ./tokenizer.js
```


In fisierul `./lab2/Aniversarea_Teatrului_Național_Iași.txt` se afla monsta pentru test.
Parser-ul imparte textul in cuvinte separate de spatiu dupa care itereaza vectorul de valori si construieste un obiect Token care contine informatie despre ce reprezinta cuvantul.

Tipul Token are la randul sau un camp Node care contine date mai abstracte despre Token, cum ar fi:
 1. posibile tipuri: substantiv (noun), substantiv propriu - nume de oras, tara, persoana
 2. nivel de ambiguitate 

Aceste date sunt adaugate pentru optimizari in iteratii urmatoare. Spre exemplu un substantiv va fi reanalizat daca este un nume propriu cu titlul de Dl, Dna, etc sau daca este un nume compus: Alba Iulia .

Parserul detecteaza tokens de tipul:
 1. URL
 2. Email
 3. Ip
 4. Nume (generic ca NOUN type pe NODE, functia pentru detectie nume cu titlu sau nume compus nu este gata)


Rezultatele sunt in fisierul `./lab2/results.json`


TODO 
 - de curatat cuvintele de extra caractere cum ar fi tab, new-line, etc inainte de a fi analizate
 - de tratat cuvintele cu cratima
 - de corectat greseli de la impartirea pe randuri