## Prérequis

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js](https://nodejs.org/en/download/)
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Docker](https://docs.docker.com/get-docker/)

Installez Redis database
- **Windows:** [https://redis.com/ebook/appendix-a/a-3-installing-on-windows/a-3-2-installing-redis-on-window/](https://redis.com/ebook/appendix-a/a-3-installing-on-windows/a-3-2-installing-redis-on-window/)
- **MacOS:** `brew install redis` or [https://redis.io/topics/quickstart](https://redis.io/topics/quickstart)
- **Linux or MacOS:** [https://redis.io/topics/quickstart](https://redis.io/topics/quickstart)

Vagrant : [https://www.vagrantup.com/downloads.html](https://www.vagrantup.com/downloads.html)
Docker : [Docker Desktop](https://www.docker.com/get-started)
Minikube : [Install Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)

## Installation

Clonez le référentiel 
```shell
git clone https://github.com/Malexia/projet_devops_2023.git
```
```shell
cd projet_devops_2023/
```
Installer les dépendances
```shell
npm install
```

## Instructions

### 1. Create a web application

Pour démarrer l'application en local :
```shell
cd userapi/
```

Démarrer le serveur redis :
```shell
redis-server
```

Puis démarrer l'application :
```shell
npm start
```

L'application est disponible à l'adresse :

[localhost:3000](http://localhost:3000)

[![Application home](/image/npm_start.png)](/image/npm_start.png)

On peut ajouter,supprimer et editer des produits

[![Application edit](/image/update_product.png)](/image/update_product.png)

### 2. Apply CI/CD pipeline

Des testes sont mis en place pour tester des fonctions :

```shell
cd userapi/
```
Si redis n'est pas en cours

```shell
redis-server
```
Pour lancer les testes :
```shell
npm test
```

[![Application test](/image/npm_test.png)](/image/npm_test.png)

Les testes sont automatisés pour notre application dans Github Actions sous chaque push.

### 3. Configure and provision a virtual environment and run your application using the IaC approach

1. Démarrez Vagrant :

```bash
vagrant up
```

2. Relancez la provision avec la commande :

```bash
vagrant provision
```

3. Effectuez une vérification de l'état de santé à l'aide de `curl` :
  - Connectez-vous à la machine virtuelle en utilisant `vagrant ssh`.
  - Exécutez la commande :

    ```bash
    curl http://127.0.0.1/-/health
    userapi OK
    ```
4. Exécutez d'autres types de vérifications 

### 4. Build Docker image of your application

Pour pull l'image : 

```shell
docker pull guillaumemb73/monapp
```

### 5. Make container orchestration using Docker Compose

Build l'image :
```shell
cd userapi/
```


```shell
docker build -t guillaumemb73/monapp .
```

Démarrer le conteneur :

```shell
docker-compose up
```

[![docker build](/image/docker_build_compose.png)](/image/docker_build_compose.png)

L'application est ensuite disponible à l'adresse suivante

[localhost:8080](http://localhost:8080)

[![docker-compose up](/image/docker_compose_up.png)](/image/docker_compose_up.png)

### 6. Make docker orchestration using Kubernetes
```shell
cd k8s/
```

Entrez la commande suivante :

```shell
kubectl apply -f deployment.yaml
```
Il faut également démarrer redis :
```shell
kubectl apply -f redis-deployment.yaml
```

Vous pouvez voir le pod en cours d'exécution :

```shell
kubectl get pods
```

Puis les commandes :

```shell
kubectl apply -f service.yaml
```

```shell
kubectl apply -f redis-service.yaml
```

Pour avoir le nom des services :

```shell
kubectl get services
```

Pour accéder à un service exposé sur le cluster kubernetes

```shell
minikube service monapp-service
```
[![kubernetes](/image/k8s_get.png)](/image//k8s_get.png)

[![Application kubernetes](/image/minkube_monapp-service.png)](/image/minkube_monapp-service.png)

Pour créer les ressources PV et PVC dans le cluster appliquer les commandes suivantes

```shell
kubectl apply -f pv.yaml
```

```shell
kubectl apply -f pvc.yaml
```

Pour créer une donnée persistente :

```shell
minikube ssh
```

```shell
cd /mnt/data
```

```shell
sudo sh -c "echo 'test' > /mnt/data/index.txt"
```

[![pv dans noeud](/image/minikubessh.png)](/image/minikubessh.png)

Puis on peut observer ce fichier, pour cela il faut récupérer le nom du pod

```shell
kubectl get pods
```

Puis entrez dans le terminal du pod :

```shell
kubectl exec -it $nom_pod -- /bin/bash
```

Puis se rendre à l'endroit ou l'information est stocké

```shell
cd /mnt/data
```

Afficher les fichiers présents et on remarque la présence du fichier index.txt

```shell
ls 
```

Pour afficher le contenu

```shell
cat index.txt
```

[![pv dans pod](/image/pv_pvc_pod.png)](/image/pv_pvc_pod.png)

### 7. Make a service mesh using Istio

1. Téléchargement et installation d'Istio

- Verifier que vous avez Minikube et Docker configurés
- Télécharger la derniere version disponible grace à la commande : 
curl -L https://istio.io/downloadIstio | sh - 
- Se rendre dans le dossier contenant votre installation 
- Ajouter le client Istio à votre Path afin de rendre les commandes disponibles globalement. ( Cette configuration est temporaire ):

```bash
export PATH=$PWD/bin:$PATH
```  

2. Deployement de l'extrais d'application

- Deployer l'extrais d'application monapp
```bash
kubectl apply -f k8s/deployment.yaml
```  

3. Ouvrir l'application au traffic exterieur ( Pour l'instant elle est déployée mais pas accessible de l'exterieur )

- Associer l'application au gateway Istio
```bash
kubectl apply -f k8s/deployment.yaml
```  
puis:
```bash
kubectl apply -f k8s/service.yaml
```  

L'application va démarrer. Le sidecar Istio sera déployé au coté de tous les pods et services.
```bash
kubectl get services
```  

```bash
kubectl get pods
```  

3. Rendons nous sur l'adresse: 
```bash
 http://10.100.200.109:32701/monapp-service
```  
L'application est bien déployée

![Deployment Istio](/image/istio_deployment.png)

### 8. Implement Monitoring to your containerized application

Nous avons créé un tableau de bord pour pouvoir analysés les données de notre application sur grafana. Pour cela, nous avons mis la mémoire et le CPU analysé par l'application en %. Egalement le système d'alerte avec un graphique pour savoir quand l'application est en cours d'exécution ou non. On choisit également le deployment qu'on veut analyser

![image1](/image/image1.png)

On peut voir les différentes informations et également lorsque l'application est en cours ou non. Ici elle est en cours puisque sur le graphique la courbe est sur 0 et qu'il y'a deux clusters.

Pour activer l'alerte on peut utiliser la commande suivante :

```shell
kubectl scale deployment $nom_deployment --replicas=0
```

![image2](/image/image2.png)

On remarque maintenant que nous avons plus qu'un seul cluster et que l'alerte est sur 1. Cela est possible grâce la métrics  kube_deployment_status_available_replicable
