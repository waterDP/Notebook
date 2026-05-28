#!/usr/bin/env python
"""调用Dashscope Qwen-Image-2.0-Pro API 生成图片，支持参考图输入"""

import os
import sys
import time
import argparse
import json
import urllib.request
import urllib.error
from pathlib import Path

API_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/ai "