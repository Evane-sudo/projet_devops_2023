## Prérequis 

1. Suivez les instructions suivantes pour installer minikube suivant votre OS [Installez Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
2. Pour vérifier que l'installation s'est correctement faite vous pouvez démarrer minikube :

```bash
minikube start
```

Entrez la commande suivante et regarder si les services sont en cours d'exécution : 

```bash
minikube status
```

## Fonctionnement

1. Ouvrez un terminal
2. Créez un deployment avec un pod :

```bash
kubectl create deployment kubernetes--bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```

3. Vous pouvez également lister les pods avec la commande :

```bash
kubectl get pods
```

4. Pour exécuter une commande dans un pod :

```bash
kubectl exec $POD_NAME -- cat /etc/os-release
```

5. Pour ouvrir un terminal dans un pod :

```bash
kubectl exec -ti $POD_NAME bash
```

6. Pour exposer un service kubernetes à l'extérieur avec le deployment créer avant :

```bash
kubectl expose deployments/kubernetes--bootcamp --type="NodePort" --port 8080
```

7. Pour trouver avec quel port le service est :

```bash
kubectl get services
```

Et avoir son ip :

```bash
minikube ip
```

8. Ouvrir le service : 

```bash
minikube service $SERVICE_NAME
```

9. On peut maintenant augmenter le nombre de pods avec la commande suivante :

```bash
kubectl scale deployments/kubernetes-bootcamp --replicas=5
```

Et utiliser cette commande pour vérifier que les pods sont bien ajoutés :

```bash
kubectl get pods
```

On observe 5 pods qui run sous le nom kubernetes--bootcamp

Pour revenir à 2 on peut utiliser la première commande du 9. en remplaçant 5 par 2. En réitérant la deuxième commande on observe que 2 pods ont le status running et les 3 autres terminating.

10. Pour supprimer un service on peut utiliser la commande suivante : 

```bash
kubectl delete service $SERVICE_NAME
kubectl delete deployment $DEPLOYMENT_NAME
```

et pour afficher les services, la commande de l'étape 7.

11. Pour exécuter le fichier yaml vous devez d'abord vous rendre dans le bon chemin : 

```bash
cd
```

Et exécuter la commande suivante (ou lorsqu'on modifie ce code): 

```bash
kubectl apply -f deployment.yaml
```

De même pour les services avec la commande suivante :

```bash
kubectl apply -f service.yaml
```

Vous pouvez lancer le service avec la commande suivante :

```bash
minikube service nom_du_service
```

Le site est ensuite accessible à l'adresse suivante [localhost](http://192.168.59.101:30365/)

En créant 3 replic, on peut voir qu'en rafraichissant la page, celle-ci peut run sur un différent pod (running on : changement de pod)
(dans le fichier service.yaml on définit le port à l'adresse entre 30 000 et 35000)


