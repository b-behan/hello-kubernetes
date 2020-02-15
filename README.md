
# Initial Setup

## Install kubectl
The Kubernetes `kubectl` client is used to access the Kubernetes cluster. The following describes
how to install the client:
https://kubernetes.io/docs/tasks/tools/install-kubectl/

## Add the kubeconfig file
The `kubectl` client uses the kubeconfig file to determine how to communicate with the Kubernetes
API server in various clusters. By default it will look for a `$HOME/.kube/config` file. Take a
backup of any existing config file, and save the provided config file to that location.

## Check that kubectl is configured correctly
```bash
kubectl cluster-info
```

# Access Monitoring Services

### Foglight
An instance configured to monitor this cluster can be accessed here: 
https://dpfog.westus.cloudapp.azure.com:8443/

### Kubernetes Dashboard
Start a proxy to the Kubernetes cluster:
```bash
kubectl proxy
```
Access the Kubernetes Dashboard: http://localhost:8001 

### Grafana
Start a second proxy to forward local traffic to the Grafana service:
```bash
kubectl port-forward svc/grafana 3000:80 
```
Access Grafana via the proxy: http://localhost:3000 


# Deploy a Service

1. Edit the `yaml/hello-kubernetes.yaml` file
2. Search and replace in the file to change all instances of “foo” to your username (e.g. “jsmith”)
3. Deploy the service with `kubectl apply -f yaml/hello-kubernetes.yaml`
4. Navigate to service specific endpoint http://13.88.137.222/jsmith

# Change the Welcome Message

1. Edit the `yaml/hello-kubernetes.yaml` file
2. Change the value of the `MESSAGE` environment variable
3. Deploy the updated configuration with `kubectl apply -f yaml/hello-kubernetes.yaml`

# Test Self Healing

1. Use kubectl to ssh into a pod: `kubectl exec -it svc/hello-jsmith sh`
2. List the processing running: `ps -ef`
3. Kill the node server (PID 17?): `kill -9 17`
4. Will be disconnected since the pod ends when the container exits
5. Should still be able to access the service specific endpoint http://13.88.137.222/jsmith

# Force Deployment to Fail
1. Edit the `yaml/hello-kubernetes.yaml` file and modify the request and limit for memory to 1MiB:
```yaml
          resources:
            requests:
              memory: 1Mi
              cpu: 0.05
            limits:
              memory: 1Mi
```
2. Deploy the updated configuration: `kubectl apply -f yaml/hello-kubernetes.yaml`
3. Pod enters crash loop
4. Service is still accessible because of rolling deploy leaves original version of pod running

# Make Pod Unschedulable
1. Edit the `yaml/hello-kubernetes.yaml` file and modify the request and limit for memory to 1MiB:
```yaml
          resources:
            requests:
              memory: 100Gi
              cpu: 0.05
            limits:
              memory: 100Gi
```
2. Deploy the updated configuration: `kubectl apply -f yaml/hello-kubernetes.yaml`
3. Kubernetes is not able to schedule the pod to run on any node in the cluster
4. Service is still accessible

# Restore the Resource Configuration
1. Edit the `yaml/hello-kubernetes.yaml` file and restore the request and limit for memory to:
```yaml
          resources:
            requests:
              memory: 32Mi
              cpu: 0.05
            limits:
              memory: 64Mi
```
2. Deploy the updated configuration: `kubectl apply -f yaml/hello-kubernetes.yaml`
3. Kubernetes is able to complete the deployment

