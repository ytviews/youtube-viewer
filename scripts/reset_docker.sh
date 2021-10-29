#!/usr/bin/env bash

###############################################################################
#                                                                             #
# `youtube-viewer`                                                             #
# `Workspace`                                                                 #
# `reset_docker.sh`                                                           #
#                                                                             #
###############################################################################

    ##################################################
    #                                                #
    # Start                                          #
    #                                                #
    ##################################################
    echo "Starting script reset_docker" \
    ; \
    ##################################################
    #                                                #
    # Stop running docker containers                 #
    #                                                #
    ##################################################
    docker container stop \
      $(docker container ls --all --quiet) \
    ; \
    ##################################################
    #                                                #
    # Remove docker containers                       #
    #                                                #
    ##################################################
    docker container rm --force --volumes \
      $(docker container ls --all --quiet) \
    ; \
    ##################################################
    #                                                #
    # Remove docker images                           #
    #                                                #
    ##################################################
    docker image rm --force \
      $(docker image ls --all --quiet) \
    ; \
    ##################################################
    #                                                #
    # Remove docker networks                         #
    #                                                #
    ##################################################
    docker network rm \
      $(docker network ls \
          --filter \
              type=custom \
          --quiet \
      ) \
    ; \
    ##################################################
    #                                                #
    # Remove docker volumes                          #
    #                                                #
    ##################################################
    docker volume rm --force \
      $(docker volume ls --quiet) \
    ; \
    ##################################################
    #                                                #
    # Finish                                         #
    #                                                #
    ##################################################
    echo "Finishing script reset_docker"