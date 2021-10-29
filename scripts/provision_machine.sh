#!/usr/bin/env bash

###############################################################################
#                                                                             #
# `youtube-viewer`                                                             #
# `Workspace`                                                                 #
# `provision_machine.sh`                                                      #
#                                                                             #
###############################################################################

    ##################################################
    #                                                #
    # Start                                          #
    #                                                #
    ##################################################
    echo "Starting script provision_machine" \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    sudo apt-get update --assume-yes --quiet \
    && \
    sudo apt-get upgrade --assume-yes --quiet \
    && \
    sudo apt-get dist-upgrade --assume-yes --quiet \
    && \
    sudo apt-get full-upgrade --assume-yes --quiet \
    && \
    sudo apt-get autoclean --assume-yes --quiet \
    && \
    sudo apt-get autoremove --assume-yes --quiet \
    && \
    sudo apt-get clean --assume-yes --quiet \
    && \
    sudo apt-get purge --assume-yes --quiet \
    && \
    sudo apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Install dependencies                           #
    #                                                #
    ##################################################
    sudo apt-get install --assume-yes --quiet \
        apt-transport-https \
        bash \
        ca-certificates \
        curl \
        git \
        gnupg \
        lsb-release \
        nano \
        openssh-client \
        openssh-server \
        wget \
        zsh \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    sudo apt-get update --assume-yes --quiet \
    && \
    sudo apt-get upgrade --assume-yes --quiet \
    && \
    sudo apt-get dist-upgrade --assume-yes --quiet \
    && \
    sudo apt-get full-upgrade --assume-yes --quiet \
    && \
    sudo apt-get autoclean --assume-yes --quiet \
    && \
    sudo apt-get autoremove --assume-yes --quiet \
    && \
    sudo apt-get clean --assume-yes --quiet \
    && \
    sudo apt-get purge --assume-yes --quiet \
    && \
    sudo apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Add docker gpg keys                            #
    #                                                #
    ##################################################
    curl \
        --fail \
        --location \
            https://download.docker.com/linux/"$( \
                lsb_release --id --short \
                    | tr '[:upper:]' '[:lower:]' \
            )"/gpg \
        --show-error \
        --silent \
    | sudo gpg \
        --dearmor \
        --output \
            /usr/share/keyrings/docker-archive-keyring.gpg \
        --yes \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    sudo apt-get update --assume-yes --quiet \
    && \
    sudo apt-get upgrade --assume-yes --quiet \
    && \
    sudo apt-get dist-upgrade --assume-yes --quiet \
    && \
    sudo apt-get full-upgrade --assume-yes --quiet \
    && \
    sudo apt-get autoclean --assume-yes --quiet \
    && \
    sudo apt-get autoremove --assume-yes --quiet \
    && \
    sudo apt-get clean --assume-yes --quiet \
    && \
    sudo apt-get purge --assume-yes --quiet \
    && \
    sudo apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Add docker sources                             #
    #                                                #
    ##################################################
    printf \
        '%s' \
            "deb" \
            " " \
            "[" \
            "arch=amd64" \
            " " \
            "signed-by=/usr/share/keyrings/docker-archive-keyring.gpg" \
            "]" \
            " " \
            "https://download.docker.com/linux/$( \
                lsb_release --id --short \
                    | tr '[:upper:]' '[:lower:]' \
            )" \
            " " \
            "$(lsb_release --codename --short)" \
            " " \
            "stable" \
    | sudo tee \
        /etc/apt/sources.list.d/docker.list \
    > /dev/null \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    sudo apt-get update --assume-yes --quiet \
    && \
    sudo apt-get upgrade --assume-yes --quiet \
    && \
    sudo apt-get dist-upgrade --assume-yes --quiet \
    && \
    sudo apt-get full-upgrade --assume-yes --quiet \
    && \
    sudo apt-get autoclean --assume-yes --quiet \
    && \
    sudo apt-get autoremove --assume-yes --quiet \
    && \
    sudo apt-get clean --assume-yes --quiet \
    && \
    sudo apt-get purge --assume-yes --quiet \
    && \
    sudo apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Install docker                                 #
    #                                                #
    ##################################################
    sudo apt-get install --assume-yes --quiet \
        containerd.io \
        docker-ce \
        docker-ce-cli \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    sudo apt-get update --assume-yes --quiet \
    && \
    sudo apt-get upgrade --assume-yes --quiet \
    && \
    sudo apt-get dist-upgrade --assume-yes --quiet \
    && \
    sudo apt-get full-upgrade --assume-yes --quiet \
    && \
    sudo apt-get autoclean --assume-yes --quiet \
    && \
    sudo apt-get autoremove --assume-yes --quiet \
    && \
    sudo apt-get clean --assume-yes --quiet \
    && \
    sudo apt-get purge --assume-yes --quiet \
    && \
    sudo apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Install docker-compose cli                     #
    #                                                #
    ##################################################
    sudo curl \
        --location \
            https://github.com/docker/compose/releases/download/1.29.2/docker-compose-"$(uname --kernel-name)"-"$(uname --machine)" \
        --output \
            /usr/local/bin/docker-compose \
    && \
    sudo chmod +x /usr/local/bin/docker-compose \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    sudo apt-get update --assume-yes --quiet \
    && \
    sudo apt-get upgrade --assume-yes --quiet \
    && \
    sudo apt-get dist-upgrade --assume-yes --quiet \
    && \
    sudo apt-get full-upgrade --assume-yes --quiet \
    && \
    sudo apt-get autoclean --assume-yes --quiet \
    && \
    sudo apt-get autoremove --assume-yes --quiet \
    && \
    sudo apt-get clean --assume-yes --quiet \
    && \
    sudo apt-get purge --assume-yes --quiet \
    && \
    sudo apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Allow non-root docker cli usage                #
    #                                                #
    ##################################################
    sudo groupadd --force docker \
    && \
    sudo usermod --append --groups docker "${USER}" \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    sudo apt-get update --assume-yes --quiet \
    && \
    sudo apt-get upgrade --assume-yes --quiet \
    && \
    sudo apt-get dist-upgrade --assume-yes --quiet \
    && \
    sudo apt-get full-upgrade --assume-yes --quiet \
    && \
    sudo apt-get autoclean --assume-yes --quiet \
    && \
    sudo apt-get autoremove --assume-yes --quiet \
    && \
    sudo apt-get clean --assume-yes --quiet \
    && \
    sudo apt-get purge --assume-yes --quiet \
    && \
    sudo apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Install oh-my-zsh                              #
    #                                                #
    ##################################################
    if \
        ! [ -d /home/"${USER}"/.oh-my-zsh ] \
    ; \
        then \
            git clone https://github.com/ohmyzsh/ohmyzsh.git /home/"${USER}"/.oh-my-zsh \
        ; \
    fi \
    && \
    cp /home/"${USER}"/.oh-my-zsh/templates/zshrc.zsh-template /home/"${USER}"/.zshrc \
    && \
    sed --in-place "s/plugins=(git)/plugins=(docker docker-compose git)/g" /home/"${USER}"/.zshrc \
    && \
    sed --in-place "s/ZSH_THEME=\"robbyrussell\"/ZSH_THEME=\"geoffgarside\"/g" /home/"${USER}"/.zshrc \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    sudo apt-get update --assume-yes --quiet \
    && \
    sudo apt-get upgrade --assume-yes --quiet \
    && \
    sudo apt-get dist-upgrade --assume-yes --quiet \
    && \
    sudo apt-get full-upgrade --assume-yes --quiet \
    && \
    sudo apt-get autoclean --assume-yes --quiet \
    && \
    sudo apt-get autoremove --assume-yes --quiet \
    && \
    sudo apt-get clean --assume-yes --quiet \
    && \
    sudo apt-get purge --assume-yes --quiet \
    && \
    sudo apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Change default shell                           #
    #                                                #
    ##################################################
    sudo chsh --shell "$(which zsh)" "${USER}" \
    && \
    ##################################################
    #                                                #
    # Change max user watchers                       #
    #                                                #
    ##################################################
    sysctl -w fs.inotify.max_user_watches=524288 \
    && \
    sysctl -p \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    sudo apt-get update --assume-yes --quiet \
    && \
    sudo apt-get upgrade --assume-yes --quiet \
    && \
    sudo apt-get dist-upgrade --assume-yes --quiet \
    && \
    sudo apt-get full-upgrade --assume-yes --quiet \
    && \
    sudo apt-get autoclean --assume-yes --quiet \
    && \
    sudo apt-get autoremove --assume-yes --quiet \
    && \
    sudo apt-get clean --assume-yes --quiet \
    && \
    sudo apt-get purge --assume-yes --quiet \
    && \
    sudo apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Finish                                         #
    #                                                #
    ##################################################
    echo "Finishing script provision_machine"