import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app


class TimerUiTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_index_page_contains_timer_and_leaderboard(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('id="timer"', html)
        self.assertIn('id="leaderboard-table"', html)
        self.assertIn('Top 10 Fastest Times', html)

    def test_index_page_has_dedicated_message_area(self):
        response = self.client.get('/')
        html = response.get_data(as_text=True)
        self.assertIn('class="controls-row"', html)
        self.assertIn('class="message-area"', html)
        self.assertIn('id="message"', html)


if __name__ == '__main__':
    unittest.main()
