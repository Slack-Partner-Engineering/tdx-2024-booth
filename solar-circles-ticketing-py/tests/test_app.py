import logging
import os
from unittest.mock import MagicMock, patch
from urllib import request

from tests.utils import build_fake_urlopen, remove_os_env_temporarily, restore_os_env

old_env = remove_os_env_temporarily()
os.environ["SLACK_BOT_TOKEN"] = "xoxb-test"

with patch.object(request, "urlopen") as mock_urlopen:
    mock_urlopen.side_effect = build_fake_urlopen(body={"ok": True})

    from app import handle_sample_function_event

restore_os_env(old_env)


class TestApp:
    def setup_method(self):
        self.old_os_env = remove_os_env_temporarily()
        os.environ["SLACK_BOT_TOKEN"] = "xoxb-test"

    def teardown_method(self):
        restore_os_env(self.old_os_env)

    def test_handle_sample_function_event(self):
        fake_inputs = {
            "title": "this is a test",
            "description": "this is a test",
            "severity": "High",
            "channel": "C1234",
            "user": "U1234",
        }
        fake_say = MagicMock()
        fake_fail = MagicMock()
        fake_complete = MagicMock()

        handle_sample_function_event(
            inputs=fake_inputs,
            say=fake_say,
            fail=fake_fail,
            complete=fake_complete,
            logger=logging.Logger("tests/test_app.py"),
        )

        fake_fail.assert_not_called()
        fake_say.assert_called_once()
        assert fake_say.call_args.kwargs["channel"] == fake_inputs["channel"]
        fake_complete.assert_called_once_with(
            outputs={
                "title": "this is a test",
                "description": "this is a test",
                "severity": "High",
                "channel": "C1234",
                "user": "U1234",
            }
        )
