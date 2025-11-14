

 sudo apt-get update


NVIDIA_DRIVER_VERSION=$(sudo apt-cache search 'linux-modules-nvidia-[0-9]+-gcp$' | awk '{print $1}' | sort | tail -n 1 | head -n 1 | awk -F"-" '{print $4}')


--

cuda

wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-ubuntu2204.pin

sudo mv cuda-ubuntu2204.pin /etc/apt/preferences.d/cuda-repository-pin-600

wget https://developer.download.nvidia.com/compute/cuda/13.0.2/local_installers/cuda-repo-ubuntu2204-13-0-local_13.0.2-580.95.05-1_amd64.deb

sudo dpkg -i cuda-repo-ubuntu2204-13-0-local_13.0.2-580.95.05-1_amd64.deb

sudo cp /var/cuda-repo-ubuntu2204-13-0-local/cuda-*-keyring.gpg /usr/share/keyrings/


sudo apt-get update

sudo apt-get -y install cuda-toolkit-13-0

sudo apt-get install -y cuda-drivers

---


sudo apt-get update && sudo apt-get install -y --no-install-recommends \
   curl \
   gnupg2


curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

    sudo apt-get update

    export NVIDIA_CONTAINER_TOOLKIT_VERSION=1.18.0-1
  sudo apt-get install -y \
      nvidia-container-toolkit=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      nvidia-container-toolkit-base=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      libnvidia-container-tools=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      libnvidia-container1=${NVIDIA_CONTAINER_TOOLKIT_VERSION}



      --


      sudo nvidia-ctk runtime configure --runtime=docker
      sudo systemctl restart docker

      nvidia-ctk runtime configure --runtime=docker --config=$HOME/.config/docker/daemon.json

      