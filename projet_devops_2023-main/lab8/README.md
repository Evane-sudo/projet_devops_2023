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

## [2. Use `hostPath` storage](https://github.com/adaltas/ece-devops-2023-fall/blob/main/modules/08.storage-in-kubernetes/lab.md#2-use-hostpath-storage)

 Exécuter un pod avec la commande suivante : 

```bash
kubectl apply -f lab/hostPath/deployment.yml
```

On créer  un fichier `/mnt/hostPath/index.html`  avec du contenu à l'intérieur 

Pour cela entrez la commande :

```bash 
minikube ssh
```

Et entrez les commande suivantes une par une :

```bash
sudo mkdir /mnt/hostPath
sudo chmod -R 777 /mnt/hostPath
sudo echo 'Hello from Kubernetes storage!' > /mnt/hostPath/index.html
```

Et entrez cette commande pour afficher le contenu du fichier : 

```bash
cat /mnt/hostPath/index.html
```

On peut faire de même dans le pod avec la commande suivante : 

```bash
kubectl exec -it [nom-du-pod] -- cat /usr/share/nginx/html/index.html
```

**Verification :**

On peut pour cela delete un pod avec la commande :

```bash
kubectl delete pod [nom-du-pod]
```

Cela relance un autre pod avec un nom différent:

En entrant la commande suivante avec le nouveau pod on remarque que la data est conservé puisque le message affiché est le même : 

```bash
kubectl exec -it [nom-du-pod] -- cat /usr/share/nginx/html/index.html
```

On peut maintenant changer le nombre de pod créé en mettant 3 après replicas dans le fichier yaml [`lab/emptyDir/deployment.yml`](https://github.com/adaltas/ece-devops-2023-fall/blob/main/modules/08.storage-in-kubernetes/lab/emptyDir/deployment.yml)

En répétant la dernière commande dans chaque pod on observe  le même message affiché pour chacun donc la donnée est bien partagée.

## [3. Use PersistentVolume](https://github.com/adaltas/ece-devops-2023-fall/blob/main/modules/08.storage-in-kubernetes/lab.md#3-use-persistentvolume)

Il faut d'abord créer un index.html dans le noeud : 

```bash
minikube ssh
sudo mkdir /mnt/data
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```

Vous pouvez tester de voir si le fichier existe : 

```bash
cat /mnt/data/index.html
```

La sortie est censé être : 

```bash
Hello from kubernetes storage
```

**Creation du PersistentVolume**

Ensuite créé le PVC volume avec la commande suivante : 

```bash
kubectl apply -f lab/PVC/persistent_volume1.yml
```

Pour regarder ses informations : 

```bash 
kubectl get pv task-pv-volume
```

**Creation PersistentVolumeClaim**

Appliquer la commande suivante : 

```bash
kubectl apply -f lab/PVC/persistent_volume_claim.yml
```

Ses informations :

```bash
kubectl get pvc task-pv-claim
```

**Créer un pod**

Appliquer la commande suivante pour créer le pod :

```bash
kubectl apply -f lab/PVC/deployment_avec_pvc.yml
```

Vérifier que le pod run : 

```bash
kubectl get pod task-pv-pod
```

Allez dans le shell du conteneur :

```bash
kubectl exec -it task-pv-pod -- bash
```

Entrez la commande suivante et le message HellofromKubernetesstorage s'affiche : 

```bash
curl http://localhost/index.html
```

**Suppression**

Supprimer le Pod, le PersistentVolumeClaim et le PersistentVolume:

```bash
kubectl delete pod task-pv-pod
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

Pour supprimer le fichier :

```bash
sudo rm /mnt/data/index.html
sudo rmdir /mnt/data
```

