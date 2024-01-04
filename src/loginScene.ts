import { Scene } from "excalibur";
import { v4 as uuidv4 } from 'uuid';

interface LoginResponse {
  id:string
  responser: string
  result: {
    code: number
    message: string
    session_key?: string
  }
}
interface LogResponse {
  id:string
  responser: string
  result: {
    code: number
    message: string
    log_info?: {
      task_id: string
      log_content: string
    }
  }
}

export class LoginScene extends Scene {
  public hook: CallableFunction;
  constructor(hook: CallableFunction) {
    super()
    this.hook = hook
  }
  public onActivate(): void {

    this.getlog().then((res) => {
      if (res === null) {
        alert("登陆失败，请检查登陆的参数并刷新重试")
        return
      } 
      this.hook(res)
    }).catch(error => {
      console.error(error)
      alert("登陆失败，请检查登陆的参数并刷新重试")
    })
  }

  public async login(user:string, access_code: string): Promise<LoginResponse> {
    const res = await fetch("/user_management/api/login/", {
      method: "post",
      body: JSON.stringify({
        "id": uuidv4(),
        "caller": "bythere.user.api",
        "caller_info": {
          "version": "frontend",
        },
        "responser": "bythere.user.login",
        "params": {
          user,
          access_code
        }
      })
    })
    return res.json()
  }

  public async getlog(): Promise<string|null> {
    const currentUrl = window.location.href;

    // 解析查询字符串
    const queryString = new URL(currentUrl).search;

    // 如果需要分割并获取具体的参数
    const queryParams = new URLSearchParams(queryString);
    const {result} =  await this.login(queryParams.get("user")!, queryParams.get("access_code")!)
    if (result.code !== 0 || !result.session_key) {
      return null
    }
    const logres = await fetch('/task_management/api/task/log_query/', {
      headers: {
        "BYTHERE-SESSION-KEY": result.session_key,
        "BYTHERE-USER": queryParams.get("user")!
      },
      method: "post",
      body: JSON.stringify({
        "id": uuidv4(),
        "caller": "bythere.user.api",
        "caller_info": {
            "version": "frontend"
        },
        "responser": "bythere.task.log_query",
        "params": {
            "namespace": queryParams.get("namespace")!,
            "task_id": queryParams.get("task_id")
        }
      })
    }).then((res) => res.json()) as LogResponse
    if (logres.result.code !== 0 || !logres.result.log_info) {
      return null
    }
    return logres.result.log_info.log_content
  }

  public onDeactivate(): void {
    this.clear();
  }

}
