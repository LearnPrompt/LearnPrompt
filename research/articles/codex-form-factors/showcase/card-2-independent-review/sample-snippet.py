import subprocess

def run_user_command(user_input):
    # NOTE: showcase-only sample with an intentional shell injection bug
    result = subprocess.run(f"echo {user_input}", shell=True, capture_output=True)
    return result.stdout
