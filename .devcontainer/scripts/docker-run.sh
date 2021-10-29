#!/usr/bin/env bash

###############################################################################
#                                                                             #
# `youtube-viewer`                                                             #
# `Container`                                                                 #
# `docker-run.sh`                                                             #
#                                                                             #
###############################################################################

DEVCONTAINER_DOCKER_COMMAND=${1}
DEVCONTAINER_DOCKER_COPY_DEST=${2}
DEVCONTAINER_DOCKER_COPY_SRC=${3}
DEVCONTAINER_DOCKER_CREATE_ENTRYPOINT=${4}
DEVCONTAINER_DOCKER_ENTRYPOINT=${5}
DEVCONTAINER_DOCKER_RUN=${6}
DEVCONTAINER_DOCKER_SOCKET=${7}
DEVCONTAINER_DOCKER_SOCKET_HOST=${8}
DEVCONTAINER_ENV_NODE_VERSION=${9}
DEVCONTAINER_ENV_YARN_VERSION=${10}
DEVCONTAINER_OH_MY_ZSH_PLUGINS=${11}
DEVCONTAINER_OH_MY_ZSH_THEME=${12}
DEVCONTAINER_USER_GID=${13}
DEVCONTAINER_USER_GROUP=${14}
DEVCONTAINER_USER_NAME=${15}
DEVCONTAINER_USER_UID=${16}

    ##################################################
    #                                                #
    # Start                                          #
    #                                                #
    ##################################################
    echo "Starting script docker-run" \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Install dependencies                           #
    #                                                #
    ##################################################
    apt-get install --assume-yes --no-install-recommends --quiet \
        apt-transport-https \
        apt-utils \
        ca-certificates \
        curl \
        dialog \
        git \
        gnupg2 \
        groff \
        htop \
        init-system-helpers \
        iproute2 \
        jq \
        less \
        libc6 \
        libgcc1 \
        libgssapi-krb5-2 \
        libicu[0-9][0-9] \
        libkrb5-3 \
        liblttng-ust0 \
        libssl1.1 \
        libstdc++6 \
        locales \
        lsb-release \
        lsof \
        man-db \
        manpages \
        manpages-dev \
        nano \
        ncdu \
        net-tools \
        openssh-client \
        procps \
        psmisc \
        rsync \
        ruby-full \
        socat \
        strace \
        sudo \
        unzip \
        vim-tiny \
        wget \
        zip \
        zlib1g \
        zsh \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Set locale                                     #
    #                                                #
    ##################################################
    echo "\nen_US.UTF-8 UTF-8" \
        >> /etc/locale.gen \
    && \
    locale-gen \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Create user                                    #
    #                                                #
    ##################################################
    groupadd --force --gid "${DEVCONTAINER_USER_GID}" "${DEVCONTAINER_USER_NAME}" \
    && \
    useradd \
        --create-home \
            "${DEVCONTAINER_USER_NAME}" \
        --gid \
            "${DEVCONTAINER_USER_NAME}" \
        --non-unique \
        --shell \
            "$(which zsh)" \
        --uid \
            "${DEVCONTAINER_USER_UID}" \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Add sudo access                                #
    #                                                #
    ##################################################
    echo "${DEVCONTAINER_USER_NAME} ALL=(root) NOPASSWD:ALL" \
        > /etc/sudoers.d/"${DEVCONTAINER_USER_NAME}" \
    && \
    chmod 0440 /etc/sudoers.d/"${DEVCONTAINER_USER_NAME}" \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Add docker keys                                #
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
        | (OUT=$(apt-key add - 2>&1) || echo "$OUT") \
    && \
    echo \
        " \
        deb \
        [arch=amd64] \
        https://download.docker.com/linux/$( \
            lsb_release --id --short \
                | tr '[:upper:]' '[:lower:]' \
        ) \
        $(lsb_release --codename --short) \
        stable \
        " \
        | xargs \
        | tee /etc/apt/sources.list.d/docker.list \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Install docker                                 #
    #                                                #
    ##################################################
    apt-get install --assume-yes --no-install-recommends --quiet \
        docker-ce-cli \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Install docker-compose                         #
    #                                                #
    ##################################################
    LATEST_DOCKER_COMPOSE_VERSION=$( \
        basename "$( \
            curl \
                --fail \
                --location \
                    https://github.com/docker/compose/releases/latest \
                --output \
                    /dev/null \
                --show-error \
                --silent \
                --write-out \
                    "%{url_effective}" \
        )" \
    ) \
    && \
    curl \
        --fail \
        --location \
            https://github.com/docker/compose/releases/download/"${LATEST_DOCKER_COMPOSE_VERSION}"/docker-compose-"$(uname --kernel-name)"-"$(uname --machine)" \
        --output \
            /usr/local/bin/docker-compose \
        --show-error \
        --silent \
    && \
    chmod +x /usr/local/bin/docker-compose \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Create docker host socket                      #
    #                                                #
    ##################################################
    touch "${DEVCONTAINER_DOCKER_SOCKET_HOST}" \
    && \
    ln --symbolic "${DEVCONTAINER_DOCKER_SOCKET_HOST}" "${DEVCONTAINER_DOCKER_SOCKET}" \
    && \
    chown --no-dereference "${DEVCONTAINER_USER_NAME}":root "${DEVCONTAINER_DOCKER_SOCKET}" \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Determine architecture                         #
    #                                                #
    ##################################################
    ARCH= \
    && \
    dpkgArch="$(dpkg --print-architecture)" \
    && \
    case \
        "${dpkgArch##*-}" \
        in \
            amd64) \
                ARCH='x64' \
            ;; \
            arm64) \
                ARCH='arm64' \
            ;; \
            armhf) \
                ARCH='armv7l' \
            ;; \
            i386) \
                ARCH='x86' \
            ;; \
            ppc64el) \
                ARCH='ppc64le' \
            ;; \
            s390x) \
                ARCH='s390x' \
            ;; \
            *) \
                echo "unsupported architecture" \
                ; \
                exit 1 \
            ;; \
    esac \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Add node keys                                  #
    #                                                #
    ##################################################
    set -o errexit -o xtrace \
    && \
    for \
        key \
    in \
        4ED778F539E3634C779C87C6D7062848A1AB005C \
        94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
        74F12602B6F1C4E913FAA37AD3A89613643B6201 \
        71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
        8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \
        C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
        C82FA3AE1CBEDC6BE46B9360C43CEC45C17AB93C \
        DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
        A48C2BEE680E841632CD4E44F07496B3EB3C1762 \
        108F52B48DB57BB0CC439B2997B01419BD92F80A \
        B9E2F5981AA6E0CD28160D9FF13993A75599653C \
    ; \
        do \
            gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys "${key}" \
            || \
            gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "${key}" \
        ; \
    done \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Download node binaries                         #
    #                                                #
    ##################################################
    curl \
        --compressed \
        --fail \
        --location \
            https://nodejs.org/dist/v"${DEVCONTAINER_ENV_NODE_VERSION}"/node-v"${DEVCONTAINER_ENV_NODE_VERSION}"-linux-"${ARCH}".tar.xz \
        --remote-name \
        --show-error \
        --silent \
    && \
    curl \
        --compressed \
        --fail \
        --location \
            https://nodejs.org/dist/v"${DEVCONTAINER_ENV_NODE_VERSION}"/SHASUMS256.txt.asc \
        --remote-name \
        --show-error \
        --silent \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Check node binaries                            #
    #                                                #
    ##################################################
    gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
    && \
    grep " node-v${DEVCONTAINER_ENV_NODE_VERSION}-linux-${ARCH}.tar.xz\$" SHASUMS256.txt \
        | sha256sum --check - \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Install node binaries                          #
    #                                                #
    ##################################################
    tar \
        --directory=/usr/local \
        --extract \
        --file=node-v"${DEVCONTAINER_ENV_NODE_VERSION}"-linux-"${ARCH}".tar.xz \
        --no-same-owner \
        --strip-components=1 \
        --xz \
    && \
    rm node-v"${DEVCONTAINER_ENV_NODE_VERSION}"-linux-"${ARCH}".tar.xz SHASUMS256.txt.asc SHASUMS256.txt \
    && \
    ln --symbolic /usr/local/bin/node /usr/local/bin/nodejs \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Smoke test node binaries                       #
    #                                                #
    ##################################################
    node --version \
    && \
    npm --version \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Add yarn keys                                  #
    #                                                #
    ##################################################
    set -o errexit -o xtrace \
    && \
    for \
        key \
    in \
        6A010C5166006599AA17F08146C2130DFD2497F5 \
    ; \
        do \
            gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys "${key}" \
            || \
            gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "${key}" \
        ; \
    done \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Download yarn binaries                         #
    #                                                #
    ##################################################
    curl \
        --compressed \
        --fail \
        --location \
            https://yarnpkg.com/downloads/"${DEVCONTAINER_ENV_YARN_VERSION}"/yarn-v"${DEVCONTAINER_ENV_YARN_VERSION}".tar.gz \
        --remote-name \
        --show-error \
        --silent \
    && \
    curl \
        --compressed \
        --fail \
        --location \
            https://yarnpkg.com/downloads/"${DEVCONTAINER_ENV_YARN_VERSION}"/yarn-v"${DEVCONTAINER_ENV_YARN_VERSION}".tar.gz.asc \
        --remote-name \
        --show-error \
        --silent \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Check yarn binaries                            #
    #                                                #
    ##################################################
    gpg --batch --verify yarn-v"${DEVCONTAINER_ENV_YARN_VERSION}".tar.gz.asc yarn-v"${DEVCONTAINER_ENV_YARN_VERSION}".tar.gz \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Install yarn binaries                          #
    #                                                #
    ##################################################
    mkdir --parents /opt \
    && \
    tar \
        --directory=/opt/ \
        --extract \
        --file=yarn-v"${DEVCONTAINER_ENV_YARN_VERSION}".tar.gz \
        --gzip \
    && \
    ln --symbolic /opt/yarn-v"${DEVCONTAINER_ENV_YARN_VERSION}"/bin/yarn /usr/local/bin/yarn \
    && \
    ln --symbolic /opt/yarn-v"${DEVCONTAINER_ENV_YARN_VERSION}"/bin/yarnpkg /usr/local/bin/yarnpkg \
    && \
    rm yarn-v"${DEVCONTAINER_ENV_YARN_VERSION}".tar.gz.asc yarn-v"${DEVCONTAINER_ENV_YARN_VERSION}".tar.gz \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Smoke test yarn binaries                       #
    #                                                #
    ##################################################
    yarn --version \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Add aws keys                                   #
    #                                                #
    ##################################################
    printf \
        '%s\n' \
            "-----BEGIN PGP PUBLIC KEY BLOCK-----" \
            "" \
            "mQINBF2Cr7UBEADJZHcgusOJl7ENSyumXh85z0TRV0xJorM2B/JL0kHOyigQluUG" \
            "ZMLhENaG0bYatdrKP+3H91lvK050pXwnO/R7fB/FSTouki4ciIx5OuLlnJZIxSzx" \
            "PqGl0mkxImLNbGWoi6Lto0LYxqHN2iQtzlwTVmq9733zd3XfcXrZ3+LblHAgEt5G" \
            "TfNxEKJ8soPLyWmwDH6HWCnjZ/aIQRBTIQ05uVeEoYxSh6wOai7ss/KveoSNBbYz" \
            "gbdzoqI2Y8cgH2nbfgp3DSasaLZEdCSsIsK1u05CinE7k2qZ7KgKAUIcT/cR/grk" \
            "C6VwsnDU0OUCideXcQ8WeHutqvgZH1JgKDbznoIzeQHJD238GEu+eKhRHcz8/jeG" \
            "94zkcgJOz3KbZGYMiTh277Fvj9zzvZsbMBCedV1BTg3TqgvdX4bdkhf5cH+7NtWO" \
            "lrFj6UwAsGukBTAOxC0l/dnSmZhJ7Z1KmEWilro/gOrjtOxqRQutlIqG22TaqoPG" \
            "fYVN+en3Zwbt97kcgZDwqbuykNt64oZWc4XKCa3mprEGC3IbJTBFqglXmZ7l9ywG" \
            "EEUJYOlb2XrSuPWml39beWdKM8kzr1OjnlOm6+lpTRCBfo0wa9F8YZRhHPAkwKkX" \
            "XDeOGpWRj4ohOx0d2GWkyV5xyN14p2tQOCdOODmz80yUTgRpPVQUtOEhXQARAQAB" \
            "tCFBV1MgQ0xJIFRlYW0gPGF3cy1jbGlAYW1hem9uLmNvbT6JAlQEEwEIAD4WIQT7" \
            "Xbd/1cEYuAURraimMQrMRnJHXAUCXYKvtQIbAwUJB4TOAAULCQgHAgYVCgkICwIE" \
            "FgIDAQIeAQIXgAAKCRCmMQrMRnJHXJIXEAChLUIkg80uPUkGjE3jejvQSA1aWuAM" \
            "yzy6fdpdlRUz6M6nmsUhOExjVIvibEJpzK5mhuSZ4lb0vJ2ZUPgCv4zs2nBd7BGJ" \
            "MxKiWgBReGvTdqZ0SzyYH4PYCJSE732x/Fw9hfnh1dMTXNcrQXzwOmmFNNegG0Ox" \
            "au+VnpcR5Kz3smiTrIwZbRudo1ijhCYPQ7t5CMp9kjC6bObvy1hSIg2xNbMAN/Do" \
            "ikebAl36uA6Y/Uczjj3GxZW4ZWeFirMidKbtqvUz2y0UFszobjiBSqZZHCreC34B" \
            "hw9bFNpuWC/0SrXgohdsc6vK50pDGdV5kM2qo9tMQ/izsAwTh/d/GzZv8H4lV9eO" \
            "tEis+EpR497PaxKKh9tJf0N6Q1YLRHof5xePZtOIlS3gfvsH5hXA3HJ9yIxb8T0H" \
            "QYmVr3aIUes20i6meI3fuV36VFupwfrTKaL7VXnsrK2fq5cRvyJLNzXucg0WAjPF" \
            "RrAGLzY7nP1xeg1a0aeP+pdsqjqlPJom8OCWc1+6DWbg0jsC74WoesAqgBItODMB" \
            "rsal1y/q+bPzpsnWjzHV8+1/EtZmSc8ZUGSJOPkfC7hObnfkl18h+1QtKTjZme4d" \
            "H17gsBJr+opwJw/Zio2LMjQBOqlm3K1A4zFTh7wBC7He6KPQea1p2XAMgtvATtNe" \
            "YLZATHZKTJyiqA==" \
            "=vYOk" \
            "-----END PGP PUBLIC KEY BLOCK-----" \
    | gpg --import \
    && \
    curl \
        --location \
            https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip.sig \
        --output \
            awscliv2.sig \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Download aws binaries                          #
    #                                                #
    ##################################################
    curl \
        --location \
            https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip \
        --output \
            awscliv2.zip \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Check aws binaries                             #
    #                                                #
    ##################################################
    gpg --verify awscliv2.sig awscliv2.zip \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Install aws binaries                           #
    #                                                #
    ##################################################
    unzip awscliv2.zip \
    && \
    ./aws/install \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Smoke test aws binaries                        #
    #                                                #
    ##################################################
    aws --version \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Install oh-my-zsh                              #
    #                                                #
    ##################################################
    if \
        ! [ -d /home/"${DEVCONTAINER_USER_NAME}"/.oh-my-zsh ] \
    ; \
        then \
            git clone https://github.com/ohmyzsh/ohmyzsh.git /home/"${DEVCONTAINER_USER_NAME}"/.oh-my-zsh \
        ; \
    fi \
    && \
    cp /home/"${DEVCONTAINER_USER_NAME}"/.oh-my-zsh/templates/zshrc.zsh-template /home/"${DEVCONTAINER_USER_NAME}"/.zshrc \
    && \
    sed --in-place "s/plugins=(git)/plugins=${DEVCONTAINER_OH_MY_ZSH_PLUGINS}/g" /home/"${DEVCONTAINER_USER_NAME}"/.zshrc \
    && \
    sed --in-place "s/ZSH_THEME=\"robbyrussell\"/ZSH_THEME=\"${DEVCONTAINER_OH_MY_ZSH_THEME}\"/g" /home/"${DEVCONTAINER_USER_NAME}"/.zshrc \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Change default shell                           #
    #                                                #
    ##################################################
    chsh --shell "$(which zsh)" "${DEVCONTAINER_USER_NAME}" \
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
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Create docker entrypoint                       #
    #                                                #
    ##################################################
    /bin/bash "${DEVCONTAINER_DOCKER_CREATE_ENTRYPOINT}" \
        "${DEVCONTAINER_DOCKER_COMMAND}" \
        "${DEVCONTAINER_DOCKER_COPY_DEST}" \
        "${DEVCONTAINER_DOCKER_COPY_SRC}" \
        "${DEVCONTAINER_DOCKER_CREATE_ENTRYPOINT}" \
        "${DEVCONTAINER_DOCKER_ENTRYPOINT}" \
        "${DEVCONTAINER_DOCKER_RUN}" \
        "${DEVCONTAINER_DOCKER_SOCKET}" \
        "${DEVCONTAINER_DOCKER_SOCKET_HOST}" \
        "${DEVCONTAINER_ENV_NODE_VERSION}" \
        "${DEVCONTAINER_ENV_YARN_VERSION}" \
        "${DEVCONTAINER_OH_MY_ZSH_PLUGINS}" \
        "${DEVCONTAINER_OH_MY_ZSH_THEME}" \
        "${DEVCONTAINER_USER_GID}" \
        "${DEVCONTAINER_USER_GROUP}" \
        "${DEVCONTAINER_USER_NAME}" \
        "${DEVCONTAINER_USER_UID}" \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Set docker entrypoint access                   #
    #                                                #
    ##################################################
    chmod +x "${DEVCONTAINER_DOCKER_ENTRYPOINT}" \
    && \
    chown "${DEVCONTAINER_USER_NAME}":root "${DEVCONTAINER_DOCKER_ENTRYPOINT}" \
    && \
    ##################################################
    #                                                #
    # Update dependencies                            #
    #                                                #
    ##################################################
    apt-get update --assume-yes --quiet \
    && \
    apt-get upgrade --assume-yes --quiet \
    && \
    apt-get dist-upgrade --assume-yes --quiet \
    && \
    apt-get full-upgrade --assume-yes --quiet \
    && \
    apt-get autoclean --assume-yes --quiet \
    && \
    apt-get autoremove --assume-yes --quiet \
    && \
    apt-get clean --assume-yes --quiet \
    && \
    apt-get purge --assume-yes --quiet \
    && \
    apt-get remove --assume-yes --quiet \
    && \
    ##################################################
    #                                                #
    # Finish                                         #
    #                                                #
    ##################################################
    echo "Finishing script docker-run"