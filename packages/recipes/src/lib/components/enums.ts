export enum COMBO_STATE {
    RCP_START = 0,
    RCP_NEW = 0,
    RCP_ADDING,
    RCP_SHOW,
    RCP_MODIFY,
    //
    ING_START = 10,
    ING_ADDING = 10,
    ING_SHOW,
    ING_MODIFY
};

export enum CROSS_STATE {
    SMALL_BLACK = 0,
    SMALL_RED,
    BLACK,
    GREEN,
    RED,
    // undef
    UNDEF
}

export enum INPUT_STATE {
    NONE = 0,
    ADD,
    MODIFY,
    SHOW,
    // undef 
    UNDEF
};

export enum RUBBER_BAND_STATE {
    NONE = 0,
    EXTEND
}

export enum ARROW_STATE {
    NONE = 0,
    SHOW,
    DOWN
}
