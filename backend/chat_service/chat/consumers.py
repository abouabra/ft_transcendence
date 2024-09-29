from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from channels.db import database_sync_to_async
from .models import Message, Server

logger = logging.getLogger(__name__)
