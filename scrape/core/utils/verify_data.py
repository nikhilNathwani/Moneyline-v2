"""
Test script to verify the new scraper architecture works.

Tests the basic components without actually scraping (to save time).
"""

import sys
import os

from core.game import Game
from core.base_scraper import BaseScraper
from oddsportal.oddsportal_scraper import OddsPortalScraper
from core.utils.export_data import save_to_json, verify_data


def test_game_object():
    """Test Game object creation and serialization."""
    print("Testing Game object...")
    
    game = Game(
        team="Lakers",
        seasonStartYear=2023,
        gameNumber=1,
        outcome=True,
        winOdds=-150,
        loseOdds=130,
        opponent="Warriors"
    )
    
    assert game.team == "Lakers"
    assert game.outcome == True
    assert game.to_dict()["team"] == "Lakers"
    
    print(f"  ✓ Game object: {game}")
    print(f"  ✓ Game to_dict: {game.to_dict()}")
    print("  ✅ Game object tests passed!\n")


def test_parser_interface():
    """Test that OddsPortalScraper implements BaseScraper."""
    print("Testing parser interface...")
    
    scraper = OddsPortalScraper(headless=True)
    assert isinstance(scraper, BaseScraper)
    
    # Check that required methods exist
    assert hasattr(scraper, 'scrapeSeasonSchedule')
    assert hasattr(scraper, 'getSeasonScheduleLinks')
    
    print("  ✅ Parser interface tests passed!\n")


def test_data_export():
    """Test data export utilities with mock data."""
    print("Testing data export utilities...")
    
    # Create mock data
    game1 = Game("Lakers", 2023, 1, True, -150, 130, "Warriors")
    game2 = Game("Lakers", 2023, 2, False, 120, -140, "Celtics")
    
    mock_data = {
        2023: {
            "Lakers": [game1, game2]
        }
    }
    
    # Test JSON export
    test_json_path = "/tmp/test_moneyline.json"
    save_to_json(mock_data, test_json_path)
    assert os.path.exists(test_json_path)
    print(f"  ✓ JSON saved to {test_json_path}")
    
    # Test verification
    is_valid = verify_data(mock_data)
    assert is_valid == True
    print("  ✓ Data verification passed")
    
    # Cleanup
    os.remove(test_json_path)
    print("  ✅ Data export tests passed!\n")


def main():
    print("=" * 60)
    print("NBA Moneyline Scraper - Architecture Tests")
    print("=" * 60 + "\n")
    
    try:
        test_game_object()
        test_parser_interface()
        test_data_export()
        
        print("=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        print("\nThe scraper architecture is working correctly.")
        print("To scrape real data, run:")
        print("  python3 main.py --seasons 2023 2024\n")
        
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
