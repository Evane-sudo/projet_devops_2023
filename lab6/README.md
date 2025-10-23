## Prérequis

1. Installez [Docker Desktop](https://www.docker.com/get-started) en suivant les instructions par rapport à votre OS.
2. Pour être sur que l'installtion de docker s'est bien réalisé vous pouvez entrez la commande suivante dans le terminal :
    
    ```
    docker run hello-world
    ```

## Fonctionnement

1. Allez dans le fichier hello-world-docker-compose [hello-docker-compose](https://github.com/Malexia/projet_devops_2023/tree/main/lab6/hello-world-docker-compose)ou à l'aide de la commande suivante : 

```shell
cd chemin_vers_votre_dossier
```

2. Entrez la commande suivante pour build l'image (vous pouvez remplacer le nom hello-world-docker-compose par celui que vous souhaitez) :

```
docker build -t hello-world-docker-compose .
```

3. Vous pouvez check si le container apparait dans les docker images avec la commande :

```shell
docker images
```

4. Vous pouvez démarrez le conteneur avec la commande suivante :

```shell
docker-compose up
```

5. Visitez le site [localhost](http://localhost:5000/) et à chaque refresh la page est vu une fois de plus

6. Vous pouvez supprimer le conteneur avec la commande suivante :

```
docker-compose rm
```

7. En répétant l'étape 4 le site est à nouveau disponible et son compteur est sauvegardé.


te to the [`lab/hello-world-docker-compose`](https://github.com/adaltas/ece-devops-2023-fall/blob/main/modules/06.docker-containers/lab/hello-world-docker-compose) d
