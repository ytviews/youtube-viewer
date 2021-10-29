#!/usr/bin/env bash

###############################################################################
#                                                                             #
# `youtube-viewer`                                                             #
# `Workspace`                                                                 #
# `update_dependencies.sh`                                                    #
#                                                                             #
###############################################################################

    ##################################################
    #                                                #
    # Start                                          #
    #                                                #
    ##################################################
    echo "Starting script update_dependencies" \
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
    echo "Finishing script update_dependencies"