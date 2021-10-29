###############################################################################
#                                                                             #
# `youtube-viewer`                                                             #
# `Container`                                                                 #
# `Dockerfile`                                                                #
#                                                                             #
###############################################################################

###############################################################################
#                                                                             #
# [from]                                                                      #
#                                                                             #
###############################################################################

ARG DEVCONTAINER_IMAGE_REPOSITORY

ARG DEVCONTAINER_IMAGE_TAG_VERSION

FROM ${DEVCONTAINER_IMAGE_REPOSITORY}:${DEVCONTAINER_IMAGE_TAG_VERSION}

###############################################################################
#                                                                             #
# [arg]                                                                       #
#                                                                             #
###############################################################################

ARG DEVCONTAINER_DOCKER_COMMAND

ARG DEVCONTAINER_DOCKER_COPY_DEST

ARG DEVCONTAINER_DOCKER_COPY_SRC

ARG DEVCONTAINER_DOCKER_CREATE_ENTRYPOINT

ARG DEVCONTAINER_DOCKER_ENTRYPOINT

ARG DEVCONTAINER_DOCKER_RUN

ARG DEVCONTAINER_DOCKER_SOCKET

ARG DEVCONTAINER_DOCKER_SOCKET_HOST

ARG DEVCONTAINER_ENV_NODE_VERSION

ARG DEVCONTAINER_ENV_YARN_VERSION

ARG DEVCONTAINER_OH_MY_ZSH_PLUGINS

ARG DEVCONTAINER_OH_MY_ZSH_THEME

ARG DEVCONTAINER_USER_GID

ARG DEVCONTAINER_USER_GROUP

ARG DEVCONTAINER_USER_NAME

ARG DEVCONTAINER_USER_UID

###############################################################################
#                                                                             #
# [env]                                                                       #
#                                                                             #
###############################################################################

ENV NODE_VERSION=${DEVCONTAINER_ENV_NODE_VERSION}

ENV YARN_VERSION=${DEVCONTAINER_ENV_YARN_VERSION}

###############################################################################
#                                                                             #
# [copy]                                                                      #
#                                                                             #
###############################################################################

COPY "${DEVCONTAINER_DOCKER_COPY_SRC}" "${DEVCONTAINER_DOCKER_COPY_DEST}"

###############################################################################
#                                                                             #
# [run]                                                                       #
#                                                                             #
###############################################################################

RUN \
    ##################################################
    #
    # Start
    #
    ##################################################
    echo "Starting script docker run" \
    && \
    ##################################################
    #                                                #
    # Docker run                                     #
    #                                                #
    ##################################################
    /bin/bash "${DEVCONTAINER_DOCKER_RUN}" \
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
    #
    # Finish
    #
    ##################################################
    echo "Finishing script docker run"

###############################################################################
#                                                                             #
# [entrypoint]                                                                #
#                                                                             #
###############################################################################

ENTRYPOINT [ "${DEVCONTAINER_DOCKER_ENTRYPOINT}" ]

###############################################################################
#                                                                             #
# [cmd]                                                                       #
#                                                                             #
###############################################################################

CMD [ "${DEVCONTAINER_DOCKER_COMMAND}" ]

###############################################################################