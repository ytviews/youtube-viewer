#!/usr/bin/env bash

###############################################################################
#                                                                             #
# `youtube-viewer`                                                             #
# `Container`                                                                 #
# `create-docker-entrypoint.sh`                                               #
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
    echo "Starting script create-docker-entrypoint.sh" \
    && \
    ##################################################
    #                                                #
    # Create docker_entrypoint.sh                    #
    #                                                #
    ##################################################
    tee "${DEVCONTAINER_DOCKER_ENTRYPOINT}" \
        > /dev/null \
<< EOF
#!/usr/bin/env bash
####################################################################################################
#                                                                                                  #
# \`youtube-viewer\`                                                                                  #
# \`Container\`                                                                                      #
# \`${DEVCONTAINER_DOCKER_ENTRYPOINT}\`                                                  #
#                                                                                                  #
####################################################################################################
##################################################
#                                                #
# Change max user watchers                       #
#                                                #
##################################################
sysctl -w fs.inotify.max_user_watches=524288
sysctl -p
##################################################
#                                                #
# Set up docker host socket access               #
#                                                #
##################################################
set -o errexit
SOCAT_PATH_BASE=/tmp/youtube-viewer
SOCAT_LOG=\${SOCAT_PATH_BASE}.log
SOCAT_PID=\${SOCAT_PATH_BASE}.pid
SOCKET_GID=\$(stat --format '%g' ${DEVCONTAINER_DOCKER_SOCKET_HOST})
if [ "\${SOCKET_GID}" != "0" ]; then
    if [ "\$(cat /etc/group | grep :"\${SOCKET_GID}":)" = "" ]; then
        sudo groupadd --gid "\${SOCKET_GID}" docker-host
    fi
    if [ "\$(id ${DEVCONTAINER_USER_NAME} | grep --extended-regexp "groups.*(=|,)\${SOCKET_GID}\(")" = "" ]; then
        sudo usermod --append --groups "\${SOCKET_GID}" ${DEVCONTAINER_USER_NAME}
    fi
else
    if [ ! -f "\${SOCAT_PID}" ] || ! ps -p "\$(cat \${SOCAT_PID})" > /dev/null; then
        sudo rm --force --recursive ${DEVCONTAINER_DOCKER_SOCKET}
        sudo socat \\
            UNIX-LISTEN:${DEVCONTAINER_DOCKER_SOCKET},fork,mode=660,user=${DEVCONTAINER_USER_NAME} \\
            UNIX-CONNECT:${DEVCONTAINER_DOCKER_SOCKET_HOST} \\
                2>&1 \\
            | sudo tee --append \${SOCAT_LOG} \\
                > /dev/null & echo "\$!" \\
                | sudo tee \${SOCAT_PID} \\
                    > /dev/null
    fi
fi
set +o errexit
##################################################
#                                                #
# Execute original command                       #
#                                                #
##################################################
exec "\$@"
EOF \
    && \
    ##################################################
    #                                                #
    # Finish                                         #
    #                                                #
    ##################################################
    echo "Finishing script create-docker-entrypoint.sh"