import requests

def generate_avatar_api(username, type='adventurer-neutral'):
    def generate_adventurer_neutral_avatar_api(username):
        base_url = f"https://api.dicebear.com/9.x/adventurer-neutral/svg"

        params = {
            "seed": username,
            "backgroundColor": "b6e3f4,c0aede,d1d4f9,ecad80,f2d3b1,ffd5dc,ffdfbf",
            "backgroundType": "gradientLinear,solid",
            "eyebrows": "variant02,variant03,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant13,variant14,variant15",
            "eyes": "variant01,variant02,variant03,variant05,variant07,variant09,variant10,variant11,variant12,variant13,variant14,variant15,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26",
            "glasses": "variant01",
            "glassesProbability": 20,
            "mouth": "variant01,variant02,variant03,variant04,variant09,variant10,variant11,variant12,variant14,variant15,variant16,variant17,variant18,variant20,variant21,variant22,variant23,variant25,variant26,variant27,variant29,variant30",    
        }
        
        response = requests.get(base_url, params=params)
        
        if response.status_code == 200:
            return response.content
        else:
            return requests.get("https://api.dicebear.com/9.x/adventurer-neutral/svg?seed={username}").content

    return generate_adventurer_neutral_avatar_api(username)

for i in range(10):
    with open(f"avatars/avatar_{i}.svg", "wb") as f:
        f.write(generate_avatar_api(f"test_{i}"))
    print(f"Avatar {i} generated")



