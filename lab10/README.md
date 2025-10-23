## Prérequis 

1. Suivez les instructions suivantes pour installer minikube suivant votre OS [Installez Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
2. Après l'installation de Minikube effectuez :

- `minikube config set vm-driver virtualbox` (or `vmware`, or `kvm2`)
- `minikube start --memory=16384 --cpus=4 --kubernetes-version=v1.18.0`

Entrez la commande suivante et regarder si les services sont en cours d'exécution : 

```bash
minikube status
```

1. Suivez les instructions suivantes pour installer minikube suivant votre OS [Installez Prometheus](https://www.prometheus.io/docs/prometheus/latest/getting_started/)

## Fonctionnement 

## 1. Premiers pas avec Istio

1. Téléchargement et installation d'Istio

- Verifier que vous avez Minikube et Docker configurés
- Télécharger la derniere version disponible grace à la commande : 
curl -L https://istio.io/downloadIstio | sh -   
( Linux et Mac )
Pour Windows se référer au site officiel 
- Se rendre dans le dossier contenant votre installation 
- Ajouter le client Istio à votre Path afin de rendre les commandes disponibles globalement. ( Cette configuration est temporaire )
```bash
export PATH=$PWD/bin:$PATH
```  
( Linux et Mac )
```bash
$env:PATH += ";C:\YourPathToIstio\istio-1.19.3\bin"
```
   ( Windows )
- Verifier les modifications
```bash
istioctl
```  
- Installer Istio sous un profile configuré en mode demo
```bash
istioctl install --set profile=demo -y
```  
- Ajouter un label afin d'indiquer à Istio de toujours injecter les proxies Envoy sidecar lors du deployement pour plus tard
```bash
kubectl label namespace default istio-injection=enabled
``` 
Affichage 
```bash
namespace/default labeled
```  


# Lab

The goal of this lab is to setup a Prometheus database and connect it to various applications.

At the end of the workshop you will also connect a vizualisation tool to your Prometheus server to get insight on your monitoring. 


## Objectives

1. Setup prometheus & monitor an app

## 1. Setup prometheus & monitor an app

1. Setup a prometheus server with Docker Compose

Créez un fichier docker-compose.yml :`  

```bash
version: '3'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana
    ports:
      - '3000:3000'
```  

Puis configurer le fichier prometheus.yml :

```bash
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'gitlab'
    static_configs:
      - targets: ['gitlab:80']  

```  
Surveillance de GitLab:

Assurons-nous que notre instance GitLab fonctionne et est accessible. Remplacons 'gitlab' dans la configuration Prometheus par le nom d'hôte réel de notre serveur GitLab ( [PLACEHOLDER] )

2. Écrire une Petite Application et la Surveiller

Créez une application Node.js simple (app.js) :


const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/status', (req, res) => {
  res.json({ status: 'OK' });
});

// Optionnellement, ajoutez une endpoint pour vérifier la base de données
app.get('/dbStatus', (req, res) => {
  // Vérifiez l'état de la base de données et fournissez des informations
  // Implémentez en fonction de votre configuration de base de données
  res.json({ dbStatus: 'En ligne' });
});

app.listen(PORT, () => {
  console.log(`Application écoutant sur le port ${PORT}`);
});
Docker Compose pour l'Application :
yaml
Copy code
version: '3'

services:
  app:
    build:
      context: .
    ports:
      - '3001:3001'
    depends_on:
      - database  # Optionnellement, si vous utilisez une base de données

  database:
    image: votre-image-de-base-de-données

    # Configurez les paramètres de votre base de données

Configuration de Prometheus pour l'Application :
Mettez à jour le fichier prometheus.yml pour inclure le nouveau job :

yaml
Copy code
scrape_configs:
  - job_name: 'node-app'
    static_configs:
      - targets: ['app:3001']


3. Démarrer Grafana et la Relier à Prometheus :

Docker Compose pour Grafana :
yaml
Copy code
version: '3'

services:
  grafana:
    image: grafana/grafana
    ports:
      - '3000:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin  # Définissez un mot de passe sécurisé
    depends_on:
      - prometheus

Configuration de Grafana :

Accédez à Grafana à http://localhost:3000 (connexion par défaut : admin/admin).

Ajoutez Prometheus en tant que source de données avec l'URL http://prometheus:9090.

Créez un tableau de bord dans Grafana pour visualiser les métriques de Prometheus.

Créer des Alertes :

Dans Grafana, vous pouvez créer des alertes basées sur les métriques. Configurez les conditions et les seuils d'alerte. Déclenchez des alertes en arrêtant vos applications.

Exécution de la Configuration :
Exécutez docker-compose up dans les répertoires où se trouvent vos fichiers docker-compose.yml.
Accédez à Prometheus à http://localhost:9090.
Accédez à Grafana à http://localhost:3000 et configurez-le.
Note : Assurez-vous que les configurations, les images Docker et la connectivité réseau correspondent à votre environnement et aux spécifications de votre application. Ajustez les paramètres en conséquence.
2. Monitor the GitLab instance on your machine

  - Prometheus should contact the gitlab server and pull its status
  - You should be able to see the the status of the Gitlab on prometheus

## 2. Write a small app and monitor it

1. Write a (really) small app that exposes a REST api with a single
endpoint which return the app state.

2. (Optionally) The application can check a database is online and give
information about this database on an endpoint. (This requires to start
another docker-compose with an empty database)

3. (Optionally) Write tests for this application using the testing framework of
your choice.

4. Monitor this application with Prometheus

## 3. See your monitoring

1. Start a Grafana container (using docker-compose)

2. Link it to the prometheus server and display the monitored applications

3. Create alerts and trigger them by shutting down your applications.
