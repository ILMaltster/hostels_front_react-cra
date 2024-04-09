declare type process = NodeJS.Process & {
    env: {
        BACK_HOST: string
    }
}